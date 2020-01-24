import React from 'react';
import PropTypes from 'prop-types';

export default class Spinner extends React.Component {

    render() {
        const size = this.props.size ? this.props.size : '50px';
        const color = this.props.color ? '3px solid ' + this.props.color : '3px solid #00965E';
        const text = this.props.text ? this.props.text : '';
        return (
            <div className="spinner">
                <div className="spinner-loader" style={{width: size, height: size}}>
                    <div className="spinner-inner spinner-one" style={{borderBottom: color}}/>
                    <div className="spinner-inner spinner-two" style={{borderRight: color}}/>
                    <div className="spinner-inner spinner-three" style={{borderTop: color}}/>
                </div>
                <span className="loading-text" style={{top: size}}>{text}</span>
            </div>
        )
    }
}

Spinner.propTypes = {
    text: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string
};



