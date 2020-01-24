import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from "../backdrop/backdrop";

export default class Select extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedItems: [],
            open: false
        };
        this.handleClose = this.handleClose.bind(this);
        this.toggle = this.toggle.bind(this)
    }

    componentDidMount() {
        const {multiple, value, values} = this.props;
        if (multiple && values) {
            this.setState({selectedItems: values})
        } else if (!multiple && value && value.label) {
            this.setState({selectedItems: [value]})
        }
    }

    componentWillReceiveProps(newProps) {
        const {selectedItems} = this.state;
        if (selectedItems && selectedItems.length > 0 && newProps.value && newProps.value.label && newProps.value.label === '') {
            this.setState({selectedItems: []})
        }
        if (newProps.value && newProps.value.label) {
            this.setState({selectedItems: [newProps.value]})
        } else if (newProps.values) {
            this.setState({selectedItems: newProps.values})
        }
    }

    handleClose() {
        this.setState({open: false})
    }

    toggle() {
        const {disabled, readOnly} = this.props;
        if (!disabled && !readOnly) {
            const {open} = this.state;
            this.setState({open: !open})
        }
    }

    toggleItem(item) {
        const {selectedItems} = this.state;
        const {multiple, onChange} = this.props;
        if (multiple) {
            const found = !!selectedItems.find(selectedItem => this.deepIsEqual(selectedItem.value, item.value));
            let tempItems = selectedItems;
            if (found) {
                tempItems = tempItems.filter(tmp => !this.deepIsEqual(item.value, tmp.value));
            } else {
                tempItems.push(item)
            }
            this.setState({selectedItems: tempItems});
            onChange(tempItems);
        } else {
            this.setState({selectedItems: [item]});
            onChange(item);
            this.handleClose()
        }
    }

    deepIsEqual(first, second) {
        // If first and second are the same type and have the same value
        // Useful if strings or other primitive types are compared
        if (first === second) return true;

        // Try a quick compare by seeing if the length of properties are the same
        let firstProps = Object.getOwnPropertyNames(first);
        let secondProps = Object.getOwnPropertyNames(second);

        // Check different amount of properties
        if (firstProps.length != secondProps.length) return false;

        // Go through properties of first object
        for (var i = 0; i < firstProps.length; i++) {
            let prop = firstProps[i];
            // Check the type of property to perform different comparisons
            switch (typeof( first[prop] )) {
                // If it is an object, decend for deep compare
                case 'object':
                    if (!deepIsEqual(first[prop], second[prop])) return false;
                    break;
                case 'number':
                    // with JavaScript NaN != NaN so we need a special check
                    if (isNaN(first[prop]) && isNaN(second[prop])) break;
                default:
                    if (first[prop] != second[prop]) return false;
            }
        }
        return true;
    };

    render() {
        const {selectedItems, open} = this.state;
        const {id, label, name, options, multiple, disabled, required, labelStyle, selectStyle} = this.props;
        return (
            <div className="marvin-select" style={selectStyle}>
                <Backdrop invisible={true} open={open} onBackdropClick={this.handleClose}/>
                <label htmlFor={id} style={labelStyle}
                       className={`${selectedItems.length > 0 ? 'shrink' : ''}`}
                       data-shrink={selectedItems.length > 0}>
                    {label} {required ? '*' : ''}
                </label>
                <div className="marvin-select-wrapper">
                    <div className={`marvin-select-container`}>
                        <div className="marvin-select-content"
                             onClick={this.toggle}
                             tabIndex="0"
                             role="button"
                             aria-pressed="false"
                             aria-haspopup="true">
                            {
                                selectedItems.length > 0 ? (
                                    <ul className="marvin-select-selected-items">
                                        {
                                            selectedItems.map((item, index) => {
                                                return (
                                                    <li key={index}
                                                        className={`marvin-select-selected-item ${multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''}`}>
                                                        {item.icon && <i className={`icofont icofont-${item.icon}`}/>}
                                                        {item.label}
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                ) : (<span>&#8203;</span>)
                            }
                        </div>
                        <input type="hidden" name={name} value={JSON.stringify(selectedItems)} id={id}/>
                        <svg className="marvin-select-arrow" focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                             role="presentation">
                            <path d="M7 10l5 5 5-5z"/>
                        </svg>
                    </div>
                </div>
                <div className={`marvin-select-list-box ${open ? 'visible' : ''}`} role="document">
                    <ul className="marvin-select-list" role="listbox">
                        {
                            options && options.length > 0 && options.map((item, index) => {
                                const selected = !!selectedItems.find(selectedItem => this.deepIsEqual(selectedItem.value, item.value));
                                return (
                                    <li key={index} className={`marvin-select-list-item ${selected ? 'selected' : ''}`}
                                        onClick={this.toggleItem.bind(this, item)}
                                        role="option"
                                        data-value={item.value}>
                                        {item.icon && <i className={`icofont icofont-${item.icon}`}/>}
                                        {item.label}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>

        )
    }
}

Select.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        value: PropTypes.string.isRequired
    }),
    values: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        value: PropTypes.any.isRequired
    })),
    name: PropTypes.string,
    labelStyle: PropTypes.object,
    selectStyle: PropTypes.object,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        value: PropTypes.any.isRequired
    }))
};
