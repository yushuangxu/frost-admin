import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useColumns from '@/hooks/useColumns';
import StandardTable from '@/components/StandardTable';
import {
    Card,
    Modal,
    Divider,
    Button,
    Input,
    notification,
    Upload,
} from 'antd';
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { fetchArticle, fetchDel, fetchAdd } from '@/store/feafures/article';
import Form from '@/components/Form';
import { isEmpty } from '@/utils/utils';
import Search from '@/components/Search';
import Editor from 'for-editor';
const { confirm } = Modal;
import styles from './index.scss';
const getBase64 = (img, callback = (url) => {}) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
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
    const [imageUrl, setImageUrl] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [row] = useState({});
    const [loading, setLoading] = useState(false);
    const getFormValue = useRef(null);
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
    const modal = () => {
        setModalShow(true);
    };
    const getFormParams = (fields, row) => {
        return fields.map((item) => {
            const [name, lang, type] = item.split('|');
            const label = lang;
            const msg = '请输入' + label;
            const val =
                typeof row[name] === 'number' ? `${row[name]}` : row[name];
            const ignoreZero = true;

            const rules = [{ required: true, message: msg }];
            return {
                name,
                label,
                render: getFormRender(name, msg, type || 'text'),
                option: {
                    rules,
                    initialValue: isEmpty(val, { ignoreZero })
                        ? undefined
                        : val,
                },
            };
        });
    };
    const submit = () => {
        if (!row.content || !row.title) {
            notification.error({
                message: '错误',
                description: '请输入文章内容或文章标题',
            });
            return false;
        }
        if (getFormValue.current) {
            const form = getFormValue?.current.getForm();
            form.validateFields()
                .then(async (valid) => {
                    row.class_name = valid.classname;
                    row.desc = valid.desc;
                    row.tag_name = valid.tagname;
                    const done = await dispatch(fetchAdd(row)).unwrap();

                    if (done) {
                        setModalShow(false);
                        setForm(false);

                        getList();
                    }
                })
                .catch((e) => {});
        }
    };
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            row.image = info.file.response.url;
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const getFormRender = (name, msg, type) => {
        const nameType = {
            image: (
                <Upload
                    className="avatar-uploader"
                    showUploadList={false}
                    listType="picture-card"
                    action="http://127.0.0.1:7001/upload/doAdd"
                    onChange={handleChange}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{ width: '100%' }}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>
            ),
            // 'class_name': <Select placeholder={msg} style={{ width: '100%' }} >
            //     {classList.map((item: any, index: number) => (
            //         <Option value="item.id">{item.name}</Option>
            //     ))}
            // </Select>,
            // 'tag_name': <Select placeholder={msg} style={{ width: '100%' }} >
            //     {tag.map((item: any, index: number) => (
            //         <Option value={item.id}>{item.tagname}</Option>
            //     ))}
            // </Select>,
            desc: <Input.TextArea placeholder={msg} />,
        };
        ///image|/.test(name)
        if (/desc|image/.test(name)) {
            return nameType[name] || {};
        }
        return <Input placeholder={msg} type={type} />;
    };

    const renderForm = () => {
        const list = ['desc|文章描述', 'image|图片'];
        return (
            <Modal
                destroyOnClose
                width={800}
                visible={modalShow}
                cancelText="取消"
                okText="确认"
                // confirmLoading={addLoading}
                onOk={submit}
                onCancel={() => {
                    setModalShow(false);
                }}
            >
                <Form
                    cRef={getFormValue}
                    onFinish={submit}
                    list={getFormParams(list, row)}
                />
            </Modal>
        );
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
                        <Button
                            className="publish"
                            onClick={modal}
                            type="primary"
                        >
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

            {renderForm()}
            {renderList()}
        </div>
    );
};
