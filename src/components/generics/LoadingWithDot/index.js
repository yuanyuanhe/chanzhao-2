import React, { Component } from 'react';
import "./index.css";
class LoadingDot extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            loadingText: this.defaultText
        }
        this.dots = [ ".", "." ];
    }

    get defaultText () {
        return ".";
    }

    componentDidMount() {
        let num = 0;
        this.intervalId = setInterval( () => {
            this.setState( {
                loadingText: this.defaultText + this.dots.slice( 0, ++num % 3 ).join( "" )
            } )
        }, 200 )
    }

    componentWillUnmount() {
        clearInterval( this.intervalId );
    }

    /**
     * 加载状态时，文字后面跟的三个点，123,123,123个
     * classes: { Array }组件引用时自定义用css类名
     * text: 点前文字
    */
    render () {
        let { classes = [], text } = this.props;
        return (
            <span className={'loading-dot ' + ( classes.join(' ') ) }>
                { text + this.state.loadingText }
            </span>
        )
    }
}

export default LoadingDot;
