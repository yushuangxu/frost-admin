import React, { useState, useRef } from 'react';
import { Input, Button } from 'antd'
import Form from '@/components/Form';
import styles from './index.scss';
import { login } from '@/models/login'
import { useNavigate } from 'react-router-dom'
import { setToken } from '@/utils/auth'
export default () => {
    return <div className={styles.container}>
        <div className={styles.bg} />
        <div className={styles.content}>
            <div>
                <From />

            </div>
        </div>
    </div>;
};
const From = () => {
    const navigate = useNavigate()
    const [row, setRow] = useState({})
    const getFormRender = (bane, msg, type) => {
        const nameType = {

        }
        if (/desc/.test(name)) {
            return nameType[name] || {};
        }
        return <Input placeholder={msg} type={type} />;
    }
    const submit = () => {
        if (getFormValue.current) {
            const form = getFormValue?.current.getForm();
            form.validateFields()
                .then(async (valid) => {
                    const payload = {
                        account: valid.account,
                        password: valid.password
                    }
                    const res = await login(payload)
                    console.log(res)
                    if (res.code === 200) {
                        setToken(res.token)
                        navigate('/', { replace: true })
                    }

                })
                .catch((e) => { });
        }
    }
    const getFormValue = useRef(null);
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
    const list = ['account|用户名', 'password|密码'];
    return <>
        <Form
            cRef={getFormValue}
            list={getFormParams(list, row)}
            onFinish={() => submit}
        />
        <Button type="primary" onClick={submit} htmlType="submit" >
            登陆
        </Button>
    </>

}