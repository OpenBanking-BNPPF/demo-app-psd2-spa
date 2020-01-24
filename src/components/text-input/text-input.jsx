import React from 'react';
import PropTypes from 'prop-types';

export default class TextInput extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const value = e.target.value;
        const {type, min, max, onChange} = this.props;
        if (type && type === 'number') {
            let valid = true;
            if (+value < min) {
                valid = false;
            }
            if (+value > max) {
                valid = false;
            }
            if (valid) {
                onChange(value)
            }
        } else {
            onChange(value)
        }
    }

    render() {
        const {
            id, label, name, value, type, placeholder, disabled, readOnly, min, max,
            required, onFocus, inputStyle, labelStyle, helperText, error
        } = this.props;
        return (
            <div className="marvin-text-input">
                <span className={`helper-text ${error ? 'error' : ''}`}>{helperText}</span>
                <input style={inputStyle}
                       onChange={this.handleChange}
                       onFocus={onFocus}
                       value={value}
                       type={type}
                       name={name}
                       min={min}
                       max={max}
                       id={id}
                       placeholder={placeholder}
                       disabled={disabled}
                       readOnly={readOnly}
                       required={required}/>
                <label htmlFor={id} style={labelStyle}>{label} {required ? '*' : ''}</label>
            </div>
        )
    }
}

TextInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    labelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
};

TextInput.defaultProps = {
    type: 'text',
    placeholder: ' ',
    disabled: false,
    readOnly: false,
    required: false,
};