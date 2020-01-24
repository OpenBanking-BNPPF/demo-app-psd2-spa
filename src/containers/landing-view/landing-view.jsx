import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string'

import { authService } from "../../services/auth/auth-service";
import Spinner from "../../components/spinner/spinner";

export default class LandingView extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    redirect(path) {
        this.props.history.push(path);
    }

    componentWillMount() {
        const authorizationCode = queryString.parse(this.props.location.search).code;
        authService.getToken(authorizationCode).subscribe(
            () => {
                this.setState({isLoading: false});
                this.redirect('/accounts')
            }
        )
    }

    render() {
        return <Spinner text="Requesting Token..."/>
    }
}

LandingView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};
