import React from 'react';
import { Table } from 'antd';

const StandardTable = (props) => {
    return (
        <div>
            <Table
                loading={props.loading}
                rowKey={props.rowKey || 'key'}
                dataSource={props.data}
                columns={props.columns}
            />
        </div>
    );
};
export default StandardTable;
