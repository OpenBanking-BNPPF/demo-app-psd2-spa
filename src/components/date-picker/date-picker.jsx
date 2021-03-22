import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";

export default class DateChooser extends React.Component {

    constructor() {
        super();
        this.state = {selectedDate: null};
    }

    componentDidMount() {
        const {value} = this.props;
        this.setState({selectedDate: value})
    }

    componentWillReceiveProps(newProps) {
        this.setState({selectedDate: newProps.value})
    }

    render() {
        const {selectedDate} = this.state;
        const {id, label, dateFormat, required, labelStyle, onChange} = this.props;
        return (
            <div className="date-chooser">
                <DatePicker
                    id={id}
                    dateFormat={dateFormat}
                    selected={selectedDate}
                    autoComplete="off"
                    onChange={date => onChange(date)}
                />
                <label htmlFor={id} className={`date-label ${selectedDate ? '' : 'empty'}`} style={labelStyle}>{label} {required ? '*' : ''}</label>
            </div>
        )
    }
}

DateChooser.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
    dateFormat: PropTypes.string.isRequired,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};