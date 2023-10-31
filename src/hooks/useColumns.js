const useColumns = (thead, renderMap, operateRender, width) => {
    const operateWidth = window.innerWidth < 400 ? 120 : width;
    const arr = thead.map((key, index) => {
        const [filed, lang, filedWidth] = key
            .split('|')
            .map((v) => v || undefined);
        const fw = /^\d+$/.test(filedWidth) ? Number(filedWidth) : filedWidth;

        const json = {
            dataIndex: filed,
            title: lang || filed,
            ellipsis: true,
            render: (t, r, j) => {
                // return <div style={{ maxWidth: fw || 'auto', display: 'inline-block' }}>
                //     {renderMap?.[filed]?.(t, r, j) || t || '-'}
                // </div>;
                return renderMap?.[filed]?.(t, r, j) || t || '-';
            },
        };
        if (fw) {
            json.width = fw;
        }
        return json;
    });

    if (operateRender) {
        const json = {
            dataIndex: 'operate',
            title: '操作',
            render: operateRender,
        };
        if (width) {
            json.fixed = 'right';
            json.width = operateWidth;
        }
        arr.push(json);
    }

    return arr;
};
export default useColumns;
