import React, { Fragment, useImperativeHandle, forwardRef } from 'react';
import { Form, Spin } from 'antd';
import { BaseLayout } from '@/utils/config';
import FooterToolbar from '@/components/FooterToolbar';

const Free = forwardRef((props) => {
    const initialValues = {};
    const _render = (_children) =>
        React.Children.map(_children, (child) => {
            const {
                children: Children,
                render,
                layout,
            } = (child || {}).props || {};
            const list = child.props['data-list'];
            if (render) return child;
            if (!Children && !child.props['data-isList']) return null;
            if (!child.props['data-isList'])
                return React.cloneElement(child, {
                    children: _render(Children),
                });
            list.forEach((name, option) => {
                initialValues[name] = option.initialValue;
            });
            return renderForm(list, layout);
        });

    const [form] = Form.useForm();
    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法
        submit: submit,
    }));
    const submit = () => {
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
        return list.map((item) => {
            const extra = {};
            if (item.label)
                extra.label = (
                    <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {item.label}
                    </span>
                );
            if (item.help)
                extra.help = <span style={{ color: 'red' }}>{item.help}</span>;
            if (item.styleType) extra.wrapperCol = { span: 18 };

            return (
                <Form.Item
                    key={item.name}
                    name={item.name}
                    rules={item?.option?.rules}
                    {...BaseLayout.formItem}
                    {...extra}
                >
                    {item.render}
                </Form.Item>
            );
        });
    };
    const { children, loading, onFinish, extra = null, footer } = props;
    return (
        <Fragment>
            <Spin spinning={!!loading}>
                <Form form={form} onFinish={onFinish}>
                    {_render(children)}
                </Form>
            </Spin>
            {footer && <FooterToolbar extra={extra}>{footer}</FooterToolbar>}
        </Fragment>
    );
});
export default Free;
