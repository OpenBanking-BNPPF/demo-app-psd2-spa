import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class PaymentSuccessView extends React.Component {

    redirect(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div id="payment-container">
                <div className="box-content success">
                    <i className="icofont icofont-emo-simple-smile"/>
                    <h4 className="payment-success-message">
                        Your payment has been requested successfully
                    </h4>
                    <button className="back-btn"
                            onClick={this.redirect.bind(this, '/accounts')}>
                        <i className="icofont icofont-reply"/>
                        back
                    </button>
                </div>
            </div>
        )
    }
}

PaymentSuccessView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};