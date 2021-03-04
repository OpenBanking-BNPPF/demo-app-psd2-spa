import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import PrivateRoute from "../components/private-route/private-route";
import LoginView from "./login-view/login-view";
import LandingView from "./landing-view/landing-view";
import AccountsView from "./accounts-view/accounts-view";
import TransactionsView from "./transactions-view/transactions-view";
import PaymentView from "./payment-view/payment-view";
import PaymentSuccessView from "./payment-success-view/payment-success-view";
import PaymentFailureView from "./payment-failure-view/payment-failure-view";

import '../static/cool-background.png';

class App extends React.Component {

    initRoutes() {
        return (
            <Switch>
                <Route path="/PaymentSuccess" component={PaymentSuccessView}/>
                <Route path="/PaymentFailure" component={PaymentFailureView}/>
                <Route path="/payment" component={PaymentView}/>
                <Route path="/landing" component={LandingView}/>
                <Route path="/login" component={LoginView}/>
                <PrivateRoute exact path="/accounts" component={AccountsView}/>
                <PrivateRoute exact path="/transactions/:accountId" component={TransactionsView}/>
                <Redirect from="*" to="/login"/>
            </Switch>
        )
    }

    render() {
        return (
            <div id="main-container" style={{backgroundImage: "url('./assets/cool-background.png')"}}>
                <div className="ob-title">OPEN<span className="green">BANK</span></div>
                {this.initRoutes()}
            </div>
        )
    }
}

export default withRouter(App)
