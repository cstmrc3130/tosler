import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import todoReducer from '../features/todoSlice'

const blacklistingSortBy = createTransform(
    null,
    (state, key) =>
    {
        // console.log(key)
        const newState = { ...state }
        
        if (key === "todo")
        {
            newState.sortBy.activeTodos = ''
            newState.sortBy.inactiveTodos = ''
        }
        
        return newState
    }
)

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['selectAll', 'sortBy'],
    transforms: [blacklistingSortBy]
};

const reducer = combineReducers({
    todo: todoReducer
})

export const store = configureStore({
    reducer: persistReducer(persistConfig, reducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:
        {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
})

export let persistor = persistStore(store)
