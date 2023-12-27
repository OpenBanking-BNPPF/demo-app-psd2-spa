import React from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentSuccessView = () => {
    const navigate = useNavigate()

    return (
            <div id="payment-container">
                <div className="box-content success">
                    <i className="icofont icofont-emo-simple-smile"/>
                    <h4 className="payment-success-message">
                        Your payment has been requested successfully
                    </h4>
                    <button className="back-btn"
                            onClick={() => navigate('/accounts')}>
                        <i className="icofont icofont-reply"/>
                    </button>
                </div>
            </div>
        )
}

export default PaymentSuccessView