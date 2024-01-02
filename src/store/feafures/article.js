import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getList, dele, add, getInfo, update } from '@/models/article';
import { trackLoadingState } from '../utils';
//初始值
const initialState = {
    article: undefined,
    info: {},
    isLoading: false,
};
export const fetchArticle = createAsyncThunk(
    'article/fetchArticle',
    async (payload) => {
        const res = await getList(payload);
        return res;
    },
);
export const fetchDel = createAsyncThunk(
    'article/fetchDel',
    async (payload) => {
        await dele(payload);
        return true;
    },
);
export const fetchAdd = createAsyncThunk(
    'article/fetchAdd',
    async (payload) => {
        await add(payload);
        return true;
    },
);
export const fetchInfo = createAsyncThunk(
    'article/fetchInfo',
    async (payload) => {
        const res = await getInfo(payload);
        return res;
    },
);
export const fetchUpdate = createAsyncThunk(
    'article/fetchUpdate',
    async (payload) => {
        const res = await update(payload);
        return res;
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
