import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authSlice from './authSlice'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'], // Only persist auth slice
    transforms: [
        {
            // Only persist essential user data
            in: (state: any) => {
                if (!state.auth?.user) return state;
                const { user } = state.auth;
                return {
                    ...state,
                    auth: {
                        ...state.auth,
                        user: {
                            _id: user._id,
                            email: user.email,
                            auth_id: user.auth_id,
                            completeProfile: user.completeProfile,
                            isVerified: user.isVerified,
                            user_name: user.user_name,
                            profile_picture: user.profile_picture
                        }
                    }
                };
            },
            out: (state: any) => state
        }
    ]
}

const rootReducer = combineReducers({
    auth: authSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;