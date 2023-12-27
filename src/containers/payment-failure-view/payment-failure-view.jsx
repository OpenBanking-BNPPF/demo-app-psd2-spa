import React  from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentFailureView = () => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
            <div id="payment-container">
                <div className="box-content failure">
                    <i className="icofont icofont-emo-sad"/>
                    <h4 className="payment-failure-message">
                        {location.state.message || 'Something went wrong! Please retry later !'}
                    </h4>
                    <button className="back-btn"
                            onClick={() => navigate('/accounts')}>
                        <i className="icofont icofont-reply"/>
                    </button>
                </div>
            </div>
        )
}

export default PaymentFailureView