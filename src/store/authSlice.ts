import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { User } from "../types/user";

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        clearAuthUser: (state) => {
            state.user = null;
        },
    },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
