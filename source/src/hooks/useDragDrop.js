import { moveArrayElement } from '@utils';
import React, { useEffect, useState } from 'react';
import useFetch from './useFetch';
import useNotification from './useNotification';

const sortColumn = {
    key: 'sort',
    width: 30,
};

function useDragDrop({ data = [], apiConfig, setTableLoading, indexField }) {
    const [sortedData, setSortedData] = useState(
        (data.length > 0 && data.sort((a, b) => a.ordering - b.ordering)) || [],
    );
    const { execute: executeOrdering } = useFetch(apiConfig);
    const notification = useNotification();
    const [dataUpdate,setDataUpdate] = useState([]);
    const [dataItemDrag, setDataItemDrag] = useState([]);
    let dataPrepare = [];
    const onDragEnd = ({ id: dragId }, { id: hoverId }) => {
        if (dragId == hoverId) return;
        const dragIndex = sortedData.findIndex((item) => item.id == dragId);
        const hoverIndex = sortedData.findIndex((item) => item.id == hoverId);
        const movedData = moveArrayElement(sortedData, dragIndex, hoverIndex);
        const after = sortedData[hoverIndex]?.[indexField];
        setSortedData(movedData);
        setDataItemDrag({
            id: sortedData[dragIndex].id,
            ordering: after,
        });
        if (dragIndex > hoverIndex) {
            for (let i = hoverIndex; i < dragIndex; i++) {
                dataPrepare.push({
                    id: sortedData[i].id,
                    ordering: sortedData[i].ordering + 1,
                });
            }
        } else if (dragIndex < hoverIndex) {
            for (let i = dragIndex; i < hoverIndex; i++) {
                dataPrepare.push({
                    id: sortedData[i].id,
                    ordering: sortedData[i].ordering - 1,
                });
            }
        }
        setDataUpdate(dataPrepare);
    };
    const handleUpdate = () => {
        executeOrdering({
            data: [dataItemDrag, ...dataUpdate],
            onCompleted: () => {
                notification({ type: 'success', message: 'Update success!' });
            },
            onError: (err) => {
                console.log(err);
                notification({ type: 'error', message: 'Update error!' });
            },
        });
    };

    useEffect(() => {
        if (data) setSortedData(data);
        else setSortedData([]);
    }, [data]);

    return { sortedData, onDragEnd, sortColumn, handleUpdate };
}

export default useDragDrop;
