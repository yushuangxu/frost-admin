import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticle } from '@/store/feafures/article';
export default () => {
    const dispatch = useDispatch();
    useEffect(() => {
        getList();
    }, []);
    const getList = () => {
        dispatch(fetchArticle({ page: 1, pageSize: 10 }));
    };
    const { article, isLoading } = useSelector((state) => state.article);
    console.log(article);
    return <div>Article</div>;
};
