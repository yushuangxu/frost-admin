import { combineReducers } from '@reduxjs/toolkit';
import article from './feafures/article';

const rootReducer = combineReducers({
    // 引入example切片
    article,
});

export default rootReducer;
