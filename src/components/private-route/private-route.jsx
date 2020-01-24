import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends React.Component {

    render() {
        const  isAuthenticated = !!sessionStorage.getItem('accessToken');
        if (isAuthenticated) {
            return (
                <Route {...this.props}/>
            )
        } else {
            return (
                <Redirect to="/login"/>
            )
        }
    }
}

