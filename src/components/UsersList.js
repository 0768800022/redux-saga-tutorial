import { Button, Flex, List } from "antd";

const UsersList = ({users, onDeleteUser}) => {
    return (
        <List>
            {users.sort((a, b) => {
                if(a.firstName > b.firstName){
                    return 1;
                } else if(a.firstName < b.firstName){
                    return -1;
                } else if(a.lastName > b.lastName){
                    return 1;
                } else if(a.lastName < b.lastName){
                    return -1;
                } else {
                    return 0;
                }
            }).map((user) => {
                return (
                    <List.Item key={user.id} style={{border: '1px solid #333', borderRadius: '20px'}}>
                        <section style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                            <div style={{flex: 1}}>
                                <span style={{marginLeft: '5px'}}>{user.firstName}</span>
                                <span style={{marginLeft: '5px'}}>
                                    {user.lastName}
                                </span>
                            </div>
                            <div style={{marginRight: '5px'}}>
                                <Button type="primary" danger onClick={() => onDeleteUser(user.id)}>
                                    Delete
                                </Button>
                            </div>
                        </section>
                    </List.Item>
                );
            })}
        </List> 
    )
}

export default UsersList;