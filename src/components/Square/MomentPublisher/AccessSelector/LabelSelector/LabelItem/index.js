import React, { Component } from 'react';
import "./index.css";
import SelectCircle from '../../../../../generics/SelectCircle';
class LabelItem extends Component{
    constructor( props ) {
        super( props );
    }

    iconClickHandler = () => {
        let { data, chooseLabel } = this.props;
        !!chooseLabel && chooseLabel( data );
    }

    nameClickHandler = () => {
        let { data, editLabel } = this.props;
        !!editLabel && editLabel( data );
    }

    /**
     * 分组item
     * selected: {Array} 已被选中的分组数据
    */
    render () {
        let { selected, data: { name } } = this.props;
        return (
            <div className={'label-item clear' + ( !!selected[ name ] ? ' cur' : '' )}>
                <span className="label-item-name auto-omit" onClick={this.nameClickHandler}>{ name }</span>
                <SelectCircle clickHandler={this.iconClickHandler}/>
                {/*<span className="label-item-icon" onClick={this.iconClickHandler}>&radic;</span>*/}
            </div>
        )
    }
}

export default LabelItem;
