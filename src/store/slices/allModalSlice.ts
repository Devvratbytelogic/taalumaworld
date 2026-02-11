/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllCommonModalState {
    isOpen: boolean;
    componentName: string | null | undefined;
    data?: any;
    endPoint: string | null;
}

interface OpenModalPayload {
    componentName: string;
    data?: any;
    // endPoint: string | null;
}

const initialState: AllCommonModalState = {
    isOpen: false,
    componentName: null,
    data: null,
    endPoint: null,
};

const allCommonModalSlice = createSlice({
    name: "allCommonModal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<OpenModalPayload>) => {
            state.isOpen = true;
            state.componentName = action.payload.componentName;
            state.data = action.payload.data;
            // state.endPoint = action.payload.endPoint;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.componentName = null;
            state.data = null;
            state.endPoint = null;
        }
    }
});

export const { openModal, closeModal } = allCommonModalSlice.actions;
export default allCommonModalSlice.reducer;
