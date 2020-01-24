import React  from 'react';
import PropTypes from 'prop-types';

export class Highlight extends React.Component {

    getTerm(){
        if (this.props.termToHighlight && this.props.termToHighlight.trim() !== '') {
            const filters = this.props.termToHighlight.match(/(([\S]+):([\S]+))/ig);
            if (filters) {
                for (const i in filters) {
                    const filter = filters[i].split(':');
                    const key = filter[0];
                    const val = filter[1];
                    if ((key.trim().toLowerCase() === 'stack' || key.trim().toLowerCase() === 's') ||
                        (key.trim().toLowerCase() === 'owner'|| key.trim().toLowerCase() === 'o') ||
                        (key.trim().toLowerCase() === 'comp'|| key.trim().toLowerCase() === 'c') ||
                        (key.trim().toLowerCase() === 'domain'|| key.trim().toLowerCase() === 'd'))                        {
                        return val
                    }
                }
            } else {
                return this.props.termToHighlight.trim();
            }

        } else {
            return ''
        }

    }

    highlight() {
        const term = this.getTerm();
        let newText;
        if (this.props.canHighlight && term && term.trim() !== '') {
            const pattern = new RegExp("(" + term + ")", "gi");
            newText = this.props.textToHighlight.replace(pattern, "<span style='color:" + this.props.color+ " !important;font-weight:bold'>" + term +"</span>");
        } else {
            return this.props.textToHighlight
        }
        return newText;

    }

    render() {
        return (
            <span dangerouslySetInnerHTML={{__html: this.highlight()}}/>
        )
    }
}

Highlight.propTypes = {
    textToHighlight: PropTypes.string.isRequired,
    termToHighlight: PropTypes.string,
    color: PropTypes.string,
    canHighlight: PropTypes.bool
};

Highlight.defaultProps = {
    color: '#F7931E',
    textToHighlight:'',
    canHighlight: true
};

export default Highlight;
