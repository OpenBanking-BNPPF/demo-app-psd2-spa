import React from 'react';
import PropTypes from 'prop-types';

export default class Backdrop extends React.Component {

    constructor() {
        super();
        this.dismiss = this.dismiss.bind(this);
    }

    dismiss(){
        const {onBackdropClick} = this.props;
        onBackdropClick();
    }

    render() {
        const {open, invisible} = this.props;
        return (
            <div className={`marvin-menu-backdrop ${open ? 'open' : ''} ${invisible ? '' : 'visible'}`}
                 onClick={this.dismiss}/>
        )
    }
}

Backdrop.defaultProps = {
    invisible: true
};

Backdrop.propTypes = {
    invisible: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    onBackdropClick: PropTypes.func.isRequired
};
