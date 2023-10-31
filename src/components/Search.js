import React from 'react';
import { Button, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BaseLayout } from '@/utils/config';
import styles from './index.scss';

const Search = (props) => {
    const { children, createText, onCreate } = props;
    return (
        <div className={styles.listSearch}>
            {!!children && children}
            <Row className={onCreate ? 'listSearchOperate' : ''}>
                {!!onCreate && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={BaseLayout.margin}
                        onClick={onCreate}
                    >
                        {createText ? `新建${createText}` : '新建'}
                    </Button>
                )}
            </Row>
        </div>
    );
};
export default Search;
