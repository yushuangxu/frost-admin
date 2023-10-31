import { configureStore } from '@reduxjs/toolkit';
import article from './feafures/article';
const store = configureStore({
    reducer: {
        article,
    },
    // middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export default store;
