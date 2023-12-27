import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";

const DateChooser = ({value, id, label, dateFormat, required, labelStyle, onChange}) => {

    const handleFocus = () => {
        const pickerLabel = document.querySelector('.date-label')
        if (pickerLabel) {
            pickerLabel.classList.remove('empty')
        }
    }

    const render = () => {
        return (
            <div className="date-chooser">
                <DatePicker
                    id={id}
                    dateFormat={dateFormat}
                    selected={value}
                    autoComplete="off"
                    onChange={date => onChange(date)}
                    onFocus={handleFocus}
                />
                <label id={`label-${id}`} htmlFor={id} className={`date-label ${value ? '' : 'empty'}`} style={labelStyle}>{label} {required ? '*' : ''}</label>
            </div>
        )
    }

    return render()
}

export default DateChooser

DateChooser.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.object,
    dateFormat: PropTypes.string.isRequired,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};