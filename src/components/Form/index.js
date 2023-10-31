import React, { Fragment, useImperativeHandle, forwardRef } from 'react';
import { Form } from 'antd';
import { BaseLayout } from '@/utils/config';

export const from = forwardRef((props) => {
    const initialValues = {};

    const [form] = Form.useForm();
    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        getForm: () => form,
    }));
    const submit = () => {
        const { onFinish } = props;
        return new Promise((resolve, reject) => {
            form.validateFields()
                .then((res) => {
                    resolve(res);
                    onFinish(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
    const renderForm = (list, layout) => {
        list.forEach((name, option) => {
            initialValues[name] = option.initialValue;
        });
        return (
            <Form
                form={form}
                onFinish={submit}
                initialValues={initialValues}
                // ref={realInputRef}
            >
                {list.map((item) => {
                    const extra = {};
                    if (item.label)
                        extra.label = (
                            <span style={{ fontWeight: 'bold', color: '#444' }}>
                                {item.label}
                            </span>
                        );
                    if (item.help)
                        extra.help = (
                            <span style={{ color: 'red' }}>{item.help}</span>
                        );
                    if (item.styleType) extra.wrapperCol = { span: 18 };
                    let dependencies = [];
                    if (item.dependencies) dependencies = item.dependencies;

                    return (
                        <Form.Item
                            key={item.name}
                            name={item.name}
                            rules={item?.option?.rules}
                            {...BaseLayout.formItem}
                            {...extra}
                            dependencies={dependencies}
                        >
                            {item.render}
                        </Form.Item>
                    );
                })}
            </Form>
        );
    };
    const { list } = props;
    return <Fragment>{renderForm(list, BaseLayout.formItem)}</Fragment>;
});
