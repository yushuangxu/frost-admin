import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useColumns from '@/hooks/useColumns';
import StandardTable from '@/components/StandardTable';
import { Card, Modal, Divider, Input, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import extract, {
    fetchExtract,
    fetchDel,
    fetchAdd,
    fetchInfo,
    fetchUpdate,
} from '@/store/feafures/extract';
import Form from '@/components/Form';
// import { isEmpty } from '@/utils/utils';
import Search from '@/components/Search';
const { confirm } = Modal;

import moment from 'moment';

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
    const thead = [
        'id||120',
        'desc|内容',
        'author|作者',
        'update_time|更新时间',
    ];
    const dispatch = useDispatch();
    const { extract, isLoading, info } = useSelector((state) => state.extract);

    const [columns, setColumns] = useState([]);
    const [isForm, setForm] = useState(false);

    const [modalShow, setModalShow] = useState(false);
    const [formState, setFormState] = useState(1); // formState: 1, //1:新建表单,2:修改表单,3:查看表单 默认不能输入
    const [row] = useState({});
    const [requst] = useState({
        desc: '',
    });

    const getFormValue = useRef(null);
    useEffect(() => {
        const { renderOperate, renderMap } = generateTableParams();

        setColumns(useColumns(thead, renderMap, renderOperate, 150));

        getList();
    }, []);

    const getInfo = async (id) => {
        const res = await dispatch(fetchInfo({ id })).unwrap();

        Object.keys(requst).forEach((k) => {
            row[k] = res?.[k];
        });

        showForm(2);
    };
    const showForm = (status) => {
        setFormState(status);
    };
    const remove = (id) => {
        showConfirm('删除?', '确定删除本条数据？', async () => {
            const done = await dispatch(fetchDel({ id })).unwrap();
            if (done) {
                getList();
            }
        });
    };
    const getList = () => {
        dispatch(fetchExtract({ page: 1, pageSize: 10 }));
    };

    const generateTableParams = () => {
        const renderOperate = (t, r) => {
            const arr = [];
            arr.push({ t: '修改', cb: async () => await getInfo(r.id) });
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
        const renderMap = {
            update_time: (t, r) =>
                moment(r.update_time).format('YYYY-MM-DD hh:ss'),
        };
        return { renderOperate, renderMap };
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
            const rules = [{ required: true, message: msg }];
            return {
                name,
                label,
                render: getFormRender(name, msg, type || 'text'),
                option: { rules, initialValue: val || undefined },
            };
        });
    };
    const submit = () => {
        const isAdd = formState === 1;

        if (getFormValue.current) {
            const form = getFormValue?.current.getForm();
            form.validateFields()
                .then(async (valid) => {
                    row.desc = valid.desc;
                    row.author = valid.author;
                    if (!isAdd) row.id = info.id;
                    const done = isAdd
                        ? await dispatch(fetchAdd(row)).unwrap()
                        : await dispatch(fetchUpdate(row)).unwrap();

                    if (done) {
                        setModalShow(false);
                        setForm(false);

                        getList();
                    }
                })
                .catch((e) => {});
        }
    };

    const getFormRender = (name, msg, type) => {
        const nameType = {
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
        if (/desc/.test(name)) {
            return nameType[name] || {};
        }
        return <Input placeholder={msg} type={type} />;
    };

    const renderForm = () => {
        const list = ['desc|文章描述', 'author|作者'];

        return (
            <Modal
                destroyOnClose={true}
                width={800}
                visible={modalShow}
                cancelText="取消"
                okText="确认"
                confirmLoading={!!isLoading}
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

    const renderList = () => {
        const { list } = extract || {};

        return (
            <Card style={{ display: isForm ? 'none' : 'block' }}>
                {/* <Search createText="" onCreate={showFrom} /> */}
                <Search createText="" onCreate={() => modal()} />
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
            {renderForm()}
            {renderList()}
        </div>
    );
};
