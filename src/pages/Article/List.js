import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useColumns from '@/hooks/useColumns';
import StandardTable from '@/components/StandardTable';
import { Card, Modal, Divider, Button, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchArticle, fetchDel } from '@/store/feafures/article';
import Search from '@/components/Search';
import Editor from 'for-editor';
const { confirm } = Modal;
import styles from './index.scss';
export default () => {
    const showConfirm = (title, content, on = () => {}) => {
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            content: content,
            onOk() {
                on();
            },
            onCancel() {},
        });
    };
    const thead = ['id||120', 'title|标题', 'desc|内容', 'updateTime|更新时间'];
    const dispatch = useDispatch();
    const { article, isLoading } = useSelector((state) => state.article);
    const [columns, setColumns] = useState([]);
    const [isForm, setForm] = useState(false);
    const [markdown, setMarkdown] = useState('');
    const [row, setRow] = useState({});

    useEffect(() => {
        const renderOperate = generateTableParams();

        setColumns(useColumns(thead, [], renderOperate, 150));
        getList();
    }, []);
    const getInfo = (id) => {};
    const remove = (id) => {
        showConfirm('删除?', '确定删除本条数据？', async () => {
            const done = await dispatch(fetchDel({ id })).unwrap();
            if (done) {
                getList();
            }
        });
    };
    const getList = () => {
        dispatch(fetchArticle({ page: 1, pageSize: 10 }));
    };
    const markdownChange = (value) => {
        setMarkdown(value);
        row.content = value;
    };
    const generateTableParams = () => {
        const renderOperate = (t, r) => {
            const arr = [];
            arr.push({ t: '修改', cb: () => getInfo(r.id) });
            arr.push({ t: '删除', cb: () => remove(r.id) });
            const show = arr.splice(0, arr.length);

            const menu = null;
            const dividerIndex = menu ? 0 : 1;
            return show.map((item, index) => {
                return (
                    <span key={index}>
                        <a onClick={item.cb}>{item.t}</a>
                        {index !== show.length - dividerIndex && (
                            <Divider type="vertical" />
                        )}
                    </span>
                );
            });
        };
        return renderOperate;
    };
    const showForm = () => {
        setForm(true);
    };

    const renderMark = () => {
        return (
            <Card title="文章" bordered={false} style={{ marginBottom: 24 }}>
                <div className={styles.editorWrap}>
                    <div className="wrap-input">
                        <Input
                            placeholder="请输入文章标题"
                            bordered={false}
                            style={{ width: '94%' }}
                            className="input"
                            onChange={(e) => {
                                row.title = e.target.value;
                            }}
                        />
                        <Button className="publish" type="primary">
                            发布
                        </Button>
                    </div>
                    <div className="editor-content">
                        <Editor
                            value={markdown}
                            onChange={(value) => markdownChange(value)}
                            height="100%"
                        />
                    </div>
                </div>
                <div className={styles.back}>
                    <Button type="primary" onClick={() => showForm(false)}>
                        返回
                    </Button>
                </div>
            </Card>
        );
    };
    const renderList = () => {
        const { list } = article || {};
        return (
            <Card style={{ display: isForm ? 'none' : 'block' }}>
                {/* <Search createText="" onCreate={showFrom} /> */}
                <Search createText="" onCreate={showForm} />
                <StandardTable
                    loading={!!isLoading}
                    data={list}
                    columns={columns}
                    rowKey="id"
                />
            </Card>
        );
    };
    return (
        <div>
            {isForm && renderMark()}

            {renderList()}
        </div>
    );
};
