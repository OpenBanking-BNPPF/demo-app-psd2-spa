import React from 'react';
import PropTypes from 'prop-types';

export class SearchBox extends React.Component {

    render() {
        const {style, placeholder, handleChange, value, handleClear} = this.props;
        return (
            <div className="search-box-container">
            <span className="search-box" style={style}>
                <i className="search-icon icofont icofont-search"/>
                <input type="text"
                       placeholder={placeholder}
                       onChange={handleChange}
                       value={value}/>
                {handleClear && value && value.length > 0 ?
                    <i onClick={handleClear} className="clear-btn icofont icofont-close"/> : ''}
            </span>
            </div>
        )
    }
}

SearchBox.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleClear: PropTypes.func,
    style: PropTypes.object,
};

SearchBox.defaultProps = {
    placeholder: 'search',
    value: '',
    style: {}
};

export default SearchBox;



