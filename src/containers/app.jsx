import * as React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/private-route/private-route";
import LoginView from "./login-view/login-view";
import LandingView from "./landing-view/landing-view";
import AccountsView from "./accounts-view/accounts-view";
import TransactionsView from "./transactions-view/transactions-view";
import PaymentView from "./payment-view/payment-view";
import PaymentSuccessView from "./payment-success-view/payment-success-view";
import PaymentFailureView from "./payment-failure-view/payment-failure-view";

import logoBack from '../static/cool-background.png';

const App = () => {

    const initRoutes = () => {
        return (
            <Routes>
                <Route path="/PaymentSuccess" element={<PaymentSuccessView/>}/>
                <Route path="/PaymentFailure" element={<PaymentFailureView/>}/>
                <Route path="/payment" element={<PaymentView/>}/>
                <Route path="/landing" element={<LandingView/>}/>
                <Route path="/login" element={<LoginView/>}/>
                <Route path='/accounts' element={<PrivateRoute/>}>
                    <Route path='/accounts' element={<AccountsView/>}/>
                </Route>
                <Route path='/transactions/:accountId' element={<PrivateRoute/>}>
                    <Route path='/transactions/:accountId' element={<TransactionsView/>}/>
                </Route>
                <Route path="*" element={<Navigate to='/login'/>}/>
            </Routes>
        )
    }

    return (
            <div id="main-container" style={{backgroundImage: `url(${logoBack})`}}>
                <div className="ob-title">OPEN<span className="green">BANK</span></div>
                {initRoutes()}
            </div>
    )
}

export default App
