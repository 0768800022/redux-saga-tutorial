import logo from '@assets/images/nav-logo.jpg';

import { EditOutlined, GlobalOutlined } from '@ant-design/icons';
import { AppConstants, UserTypes, storageKeys } from '@constants';
import { clientNav } from '@constants/menuConfig';
import useAuth from '@hooks/useAuth';
import useValidatePermission from '@hooks/useValidatePermission';
import { selectRestaurantList } from '@selectors/app';
import { appActions } from '@store/actions';
import { Layout, Menu, Tooltip } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './NavSider.module.scss';
import routes from '@routes';
import classNames from 'classnames';
import { useCallback } from 'react';
import { useCurrency } from '@components/common/elements/Currency';
import { getData } from '@utils/localStorage';
import { useEffect } from 'react';
import accountSelectors from '@selectors/account';
const { Sider } = Layout;

const NavSider = ({ collapsed, onCollapse, width }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const validatePermission = useValidatePermission();
    const { profile } = useAuth();
    const { restaurantId } = useParams();
    const dispatch = useDispatch();
    const restaurantList = useSelector(selectRestaurantList);
    const { logoPath } = useSelector(accountSelectors.selectProfile);
    const currentKey = getData(storageKeys.TENANT_ID);
    const availableMenu = makeNavs(restaurantList).filter(Boolean);
    const { fetchCurrency } = useCurrency();
    const activeNav = useMemo(() => {
        const activeNav = getMenuActives(availableMenu, location.pathname);
        if (activeNav) {
            return activeNav;
        }
        return {
            selectedKeys: [],
            openKeys: [],
        };
    }, [location.pathname, availableMenu]);

    function makeNavs(restaurantList) {
        return restaurantList?.map((res, index) => ({
            label: res.storeName,
            icon: (
                <img
                    alt={`Restaurant ${res.id}`}
                    className="icon-nav-res"
                    src={res.logoPath ? AppConstants.contentRootUrl + res.logoPath : logo}
                />
            ),
            key: res.id + '',
            actions: true,
            restaurantData: res,
            children: clientNav(res),
        }));
    }

    function findMenuActions(menus, menuTree, currentMenuTreeIndex, results, pathname) {
        for (let menu of menus) {
            if (menu.path === pathname || menu.subPaths?.some((reg) => reg.test(pathname))) {
                let key = [...results, menu.path];
                return { selectedKeys: key, openKeys: key };
            }

            const currentMenuTree = menuTree[currentMenuTreeIndex];
            if (menu.key === currentMenuTree && menu.children) {
                let key = [
                    ...results,
                    menuTree.slice(0, currentMenuTreeIndex + 1).join('-'),
                    ...findMenuActions(menu.children, menuTree, currentMenuTreeIndex + 1, results, pathname)
                        .selectedKeys,
                ];
                return { selectedKeys: key, openKeys: key };
            }
        }
        return { selectedKeys: [], openKeys: [] };
    }

    function getMenuActives(menus, pathname) {
        const tree = pathname.split('/').filter(Boolean);
        return findMenuActions(menus, tree, 0, [], pathname);
    }

    const handleClickEditRestaurant = (data) => {
        navigate(generatePath(routes.restaurantSavePage.path, { restaurantId: data.id }));
    };

    function renderMenu(listMenu = [], parentKey = '', level = 0) {
        return listMenu.filter(Boolean).map((navMenuItem, idx) => {
            return navMenuItem?.children ? (
                <SubMenu
                    key={navMenuItem.key ? parentKey + navMenuItem.key : idx}
                    onTitleClick={() => {
                        if (
                            navMenuItem.restaurantData &&
                            navMenuItem.restaurantData.tenantId &&
                            navMenuItem.restaurantData.tenantId !== currentKey
                        ) {
                            dispatch(
                                appActions.setRestaurantTenantId({
                                    tenantId: navMenuItem.restaurantData.tenantId,
                                    apiUrl: navMenuItem.restaurantData.tenantApiUrl,
                                }),
                            );
                        }
                    }}
                    disabled={navMenuItem.actions && !navMenuItem.restaurantData.tenantId}
                    title={
                        <span className={!level ? 'title-content' : ''}>
                            {navMenuItem.icon}
                            <span className="menu-label">
                                <Tooltip color="blue" placement="top" title={navMenuItem.label} mouseEnterDelay={0.7}>
                                    {navMenuItem.label}
                                </Tooltip>
                            </span>
                            {navMenuItem.actions && (
                                <EditOutlined
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleClickEditRestaurant(navMenuItem.restaurantData);
                                    }}
                                    className="nav-action-icon"
                                />
                            )}
                        </span>
                    }
                    className={navMenuItem.actions ? 'custom-sub-top' : 'custom-sub-nav'}
                >
                    {navMenuItem.actions && navMenuItem.restaurantData.tenantId
                        ? renderMenu(navMenuItem.children, parentKey + navMenuItem.key + '-', level + 1)
                        : null}
                    {!navMenuItem.actions &&
                        renderMenu(navMenuItem.children, parentKey + navMenuItem.key + '-', level + 1)}
                </SubMenu>
            ) : (
                <Menu.Item
                    key={navMenuItem?.path}
                    className="custom-sub-item"
                    onClick={() => {
                        if (
                            navMenuItem?.restaurantData &&
                            navMenuItem?.restaurantData.tenantId &&
                            navMenuItem.restaurantData.tenantId !== currentKey
                        ) {
                            dispatch(
                                appActions.setRestaurantTenantId({
                                    tenantId: navMenuItem?.restaurantData.tenantId,
                                    apiUrl: navMenuItem.restaurantData.tenantApiUrl,
                                }),
                            );
                        }
                    }}
                >
                    <Link className={styles.wrapper} to={navMenuItem?.path}>
                        {navMenuItem?.icon}
                        <div>{navMenuItem?.label}</div>
                    </Link>
                </Menu.Item>
            );
        });
    }

    useEffect(() => {
        if (currentKey) fetchCurrency({ pathParams: { id: currentKey?.split('_')[2] } });
    }, [currentKey]);

    const openMenukey = useMemo(() => {
        // console.log(restaurantId);
        // console.log(activeNav);
        // console.log(currentKey);
        // if(currentKey !== )
        return;
    }, [restaurantId, location]);

    return (
        <Sider
            className={'app-sider ' + styles.sidebar}
            collapsible
            collapsed={collapsed}
            width={width}
            onCollapse={onCollapse}
            trigger={null}
        >
            <div data-collapsed={collapsed} className={styles.logo} style={{ width: '100%' }}>
                <img src={logoPath ? `${AppConstants.contentRootUrl}${logoPath}` : logo} alt="Nav-logo" />
            </div>
            {availableMenu.length > 0 && (
                <Menu
                    key={location.pathname == '/' ? 'initial' : 'navSider'}
                    theme="dark"
                    mode="inline"
                    className={styles.menu}
                    defaultSelectedKeys={activeNav.selectedKeys}
                    defaultOpenKeys={activeNav.openKeys}
                    selectedKeys={activeNav.selectedKeys}
                    openKeys={openMenukey}
                    // items={makeNavs(profile, navMenuConfig, restaurantList)}
                    // onSelect={(item) => handleMenuItemClick(item)}
                >
                    {renderMenu(availableMenu)}
                </Menu>
            )}
        </Sider>
    );
};

export default NavSider;
