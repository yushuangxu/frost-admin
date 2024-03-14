import { configureStore } from '@reduxjs/toolkit';
import article from './feafures/article';
import extract from './feafures/extract';
const store = configureStore({
    reducer: {
        article,
        extract,
    },
    // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export default store;
