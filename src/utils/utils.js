// import { Upload } from '@/models/app';
import { notification, Modal } from 'antd';
export const isEmpty = (val, option = {}) => {
    if (option.ignoreZero && val === 0) return true;

    if (val === null) return true;
    if (val === undefined) return true;
    if (val === '') return true;
    if (typeof val === 'number') return false;
    if (typeof val === 'function') return false;
    if (typeof val === 'object') {
        if (Array.isArray(val)) return !val.length;
        return !Object.keys(val).length;
    }
};

export const generalUploadParams = (
    { limit = 10, notMandatory },
    { object, field, objKey = 'fileList' } = {},
    cb,
) => {
    let source = object ? object[field] || [] : this.state[objKey];
    console.log(source);
    return {
        accept: 'image',
        action: 'app/public/upload',
        multiple: limit > 1,
        fileList: source,
        beforeUpload: (file) => {
            if (/image/g.test(file.type) && file.size / 1024 / 1024 > 10) {
                file.status = 'error';
                Notification.error('图片最大上传10M');
            }
            return true;
        },
        customRequest: async (params) => {
            console.log(params);
            try {
                const res = await Upload(params.file);
                console.log(res);
            } catch (err) {}
        },
        onChange: (data) => {
            const { fileList, file } = data;
            console.log(data);
            if (!notMandatory) {
                // 图片走10MB限制 OSS已定死
                if (/image/g.test(file.type) && file.size / 1024 / 1024 > 10)
                    return;
                // 大小限制
                if (file.size / 1024 / 1024 > maxSize) return;
                // 类型限制
                if (typeReg && !typeReg.test(file.type)) return;
                // 数量限制
                if (fileList.length > limit)
                    return Toast.warn(`超出文件数量限制: ${limit}`);
            }

            source = fileList;
            // eslint-disable-next-line no-unused-expressions,no-param-reassign
            object && (object[field] = fileList);

            const json = {};
            if (!object) json[objKey] = source;
        },
    };
};
export const pageMethods = {
    generateOperate(arr) {
        if (!arr.length) return null;
        const len = isMobile ? 1 : arr.length === 3 ? 3 : 2;
        const show = arr.splice(0, len);
        const menu = null;
        console.log(111111);
        const dividerIndex = menu ? 0 : 1;
        return show.map((item, j) => (
            <span key={item.t}>
                <a onClick={item.cb}>{item.t}</a>
                {j !== show.length - dividerIndex && (
                    <span className="ant-divider-vertical" />
                )}
            </span>
        ));
    },
};
export const Toast = {
    ok(msg) {
        this._tip('success', msg);
    },
    warn(msg) {
        this._tip('warning', msg);
    },
    error(msg) {
        this._tip('error', msg);
    },

    _tip(method, msg) {
        const message = {
            success: '成功',
            warning: '警告',
            error: '錯誤',
        }[method];

        if (isMobile) {
            Message[method](msg);
        } else {
            notification[method]({
                message,
                description: msg,
            });
        }
    },

    confirm(option) {
        const emptyFn = () => {};
        const { icon, title, content, onOk, onCancel, ...reset } = option;
        return Modal.confirm({
            icon: icon || undefined,
            title: title || 'Confirm ?',
            content: content || '',
            okText: '确认',
            cancelText: '取消',
            onOk: onOk || emptyFn,
            onCancel: onCancel || emptyFn,
            ...reset,
        });
    },
};
