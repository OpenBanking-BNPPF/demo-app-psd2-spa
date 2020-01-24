import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class PaymentFailureView extends React.Component {

    redirect(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div id="payment-container">
                <div className="box-content failure">
                    <i className="icofont icofont-emo-sad"/>
                    <h4 className="payment-failure-message">
                        Something went wrong! Please retry later !
                    </h4>
                    <button className="back-btn"
                            onClick={this.redirect.bind(this, '/accounts')}>
                        <i className="icofont icofont-reply"/>
                    </button>
                </div>
            </div>
        )
    }
}

PaymentFailureView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};