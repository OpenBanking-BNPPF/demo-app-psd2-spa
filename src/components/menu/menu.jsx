import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from "../backdrop/backdrop";

export default class Menu extends React.Component {

    constructor() {
        super();
        this.toggle = this.toggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            open: false
        }
    }

    toggle() {
        const {open} = this.state;
        this.setState({open: !open})
    }

    handleClose() {
        this.setState({open: false});
    }

    selectItem(item) {
        if (item.onSelectItem && typeof item.onSelectItem === "function") {
            item.onSelectItem();
        }
        this.handleClose();
    }

    render() {
        const {items, color, menuId, icon, centered} = this.props;
        const {open} = this.state;
        return (
            items && items.length > 0 && (
                <div data-menu className={`menu ${centered ? 'centered': ''}`} id={menuId}>
                    <Backdrop invisible={true} open={open} onBackdropClick={this.handleClose}/>
                    <div className="menu-container">
                        <button data-menu-trigger
                                aria-haspopup="true"
                                onClick={this.toggle}
                                style={{color: color, fontSize: icon?'18px':'30px'}}
                                className={`menu-trigger ${icon ? 'icofont icofont-' + icon : 'ion ion-md-more'}`}/>
                        <ul data-menu-list className={`menu-list ${open ? 'open' : ''}`}>
                            {
                                items.map((item, index) => {
                                    return (
                                        <li key={index} onClick={this.selectItem.bind(this, item)}
                                            className="menu-list-item">
                                            {item.icon && <i className={`icofont icofont-${item.icon}`}/>}
                                            <span className="menu-list-item-label">{item.label}</span>
                                        </li>
                                    )

                                })
                            }
                        </ul>
                    </div>
                </div>
            )
        )
    }
}

Menu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        onSelectItem: PropTypes.func
    }).isRequired).isRequired,
    color: PropTypes.string,
    icon: PropTypes.string,
    maxHeight: PropTypes.number,
    menuId: PropTypes.string,
    centered: PropTypes.bool
};

Menu.defaultProps = {
    //color: 'primary',
    menuId: 'simple-menu'
};