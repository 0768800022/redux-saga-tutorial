import { Types } from "../actions/users";

const INITIAL_STATE = {
    items: [],
    error: '',
    success: ''
};

export default function users(state=INITIAL_STATE, action) {
    switch(action.type){
        case Types.GET_USERS_SUCCESS:{
            return {
                ...state,
                items: action.payload.items
            }
        }
        case Types.CREATE_USER_REQUEST: {
            console.log(action.payload);
            return {
                ...state,
                items: [...state.items, action.payload],
            }
        }
        case Types.UPDATE_USER_REQUEST: {
            console.log('Updating User:', action.payload);
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, ...action.payload }
                    : item
            );
            console.log('Updated Items:', updatedItems);
            return {
                ...state,
                items: updatedItems,
            };
        }
        
        
        case Types.DELETE_USER_REQUEST: {
            const newName = [...state.items]
            newName.splice(action.payload, 1)
            return {
                ...state,
                items: newName,
            }
        }
        case Types.USERS_SUCESS: {
            return {
                ...state,
                success: action.payload.success,
            }
        }
        case Types.USERS_ERROR: {
            return {
                ...state,
                error: action.payload.error,
            }
        }
        default: {
            return state;
        }
    }
}