import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackLoadingState } from '../utils';
import service from '../../../api/axios';
//初始值
const initialState = {
    article: undefined,
    info: {},
    isLoading: false,
};
export const fetchArticle = createAsyncThunk(
    'article/fetchArticle',
    async (data) => {

        const res = await service({
            url: '/article/list',
            method: 'get',
            data,
        });
        return res.data;
    },
);
export const fetchDel = createAsyncThunk('article/fetchDel', async (data) => {
    await service({
        url: '/article/delete',
        method: 'post',
        data: data,
    });
    return true;
});
export const fetchAdd = createAsyncThunk('article/fetchAdd', async (data) => {
    await service({
        url: '/article/add',
        method: 'post',
        data,
    });
    return true;
});
export const fetchInfo = createAsyncThunk('article/fetchInfo', async (data) => {
    const res = await service({
        url: '/article/info',
        method: 'post',
        data: data,
    });
    return res.data;
});
export const fetchUpdate = createAsyncThunk(
    'article/fetchUpdate',
    async (data) => {
        const res = await service({
            url: '/article/update',
            method: 'post',
            data: data,
        });
        return res.data;
    },
);
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        trackLoadingState(builder, fetchArticle, 'article');
        trackLoadingState(builder, fetchDel, 'del');
        trackLoadingState(builder, fetchAdd, 'add');
        trackLoadingState(builder, fetchInfo, 'info');
        trackLoadingState(builder, fetchUpdate, 'info');
    },
});
export default articleSlice.reducer;
