import React from 'react';
import './index.css';
import SegmentedBarItem from './SegmentedBarItem'

const SegmentedBar = ( { items, cur, onCurChange } ) => {
    /**
     * 导航条组件，可选择
     * cur 当前选中的的item key
     * onCurChange： item点击处理方法
     * items: { Array } item数组
     *     { key, text } text: item内文字
    */
    return (
        <div className="segmented-bar shadow">
            {items.map(v => (
                <SegmentedBarItem key={v.key} data={v} cur={cur} onCurChange={onCurChange} />
            ))}
        </div>
    );
};

export default SegmentedBar;
