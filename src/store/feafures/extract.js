import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackLoadingState } from '../utils';
import service from '../../../api/axios';
//初始值
const initialState = {
    extract: undefined,
    info: {},
    isLoading: false,
};
export const fetchExtract = createAsyncThunk(
    'extract/fetchextract',
    async (data) => {
        const res = await service({
            url: '/extract/list',
            method: 'get',
            data,
        });
        return res;
    },
);
export const fetchDel = createAsyncThunk('extract/fetchDel', async (data) => {
    await service({
        url: '/extract/delete',
        method: 'post',
        data: data,
    });
    return true;
});
export const fetchAdd = createAsyncThunk('extract/fetchAdd', async (data) => {
    await service({
        url: '/extract/add',
        method: 'post',
        data,
    });
    return true;
});
export const fetchInfo = createAsyncThunk('extract/fetchInfo', async (data) => {
    const res = await service({
        url: '/extract/info',
        method: 'post',
        data: data,
    });
    return res;
});
export const fetchUpdate = createAsyncThunk(
    'extract/fetchUpdate',
    async (data) => {
        const res = await service({
            url: '/extract/update',
            method: 'post',
            data: data,
        });
        return res;
    },
);
export const extractSlice = createSlice({
    name: 'extract',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        trackLoadingState(builder, fetchExtract, 'extract');
        trackLoadingState(builder, fetchDel, 'del');
        trackLoadingState(builder, fetchAdd, 'add');
        trackLoadingState(builder, fetchInfo, 'info');
        trackLoadingState(builder, fetchUpdate, 'info');
    },
});
export default extractSlice.reducer;
