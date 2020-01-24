import * as React from 'react';

import { authService } from "../../services/auth/auth-service";
import Spinner from "../../components/spinner/spinner";

export default class LoginView extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    componentWillMount() {
        authService.login().subscribe(
            resp => {
                this.loginURL = resp;
                this.setState({isLoading: false})
            },
            err => console.error(err)
        )
    }

    login() {
        window.location = this.loginURL
    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return <Spinner text="loading data"/>
        } else {
            return (
                <div id="login-view-container">
                    <button onClick={this.login.bind(this)}>
                        <i className="icofont icofont-login"/>
                    </button>
                    <span>This will redirect you to the authorization server of your organization</span>
                </div>
            )
        }
    }
}

