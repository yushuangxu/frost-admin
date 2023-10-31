import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getList } from '@/models/article';
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
export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        trackLoadingState(builder, fetchArticle, 'article');
        // trackLoadingState(builder, fetchInfo, 'info');
    },
});
export default articleSlice.reducer;
