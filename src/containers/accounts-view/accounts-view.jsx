import * as React from 'react';
import * as PropTypes from 'prop-types';

import { aispService } from "../../services/aisp/aisp";
import { apiService } from "../../services/apis/apis";
import { formatter } from "../../helpers/formatter/formatter";
import Spinner from "../../components/spinner/spinner";

export default class AccountsView extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            loadingMessage: '',
            loadingError: ''
        };
    }

    componentWillMount() {
        this.init()
    }

    componentWillUnmount() {
        if (this.getAccountsSubscription) this.getAccountsSubscription.unsubscribe()
        if (this.getAccountsDetailsSub) this.getAccountsDetailsSub.unsubscribe()
    }

    init() {
        this.loadAccountsInfo()
    }

    loadAccountsInfo() {
        this.setState({
            isLoading: true,
            loadingMessage: 'loading accounts information',
            loadingError: ''
        })
        this.getAccountsSubscription = aispService.getAccounts().subscribe(
            accounts => {
                const requests = [];
                if (accounts && accounts.length > 0) {
                    accounts.forEach(account => {
                        requests.push(
                            aispService.getAccountDetails(account)
                        )
                    });
                    this.getAccountsDetailsSub = apiService.concatRequests(...requests).subscribe(
                        accountsDetails => {
                            this.accounts = accountsDetails;
                            this.setState({
                                isLoading: false,
                                loadingMessage: ''
                            })
                        },
                        err => {
                            if (err.response && err.response.status === 401) {
                                this.redirect('/login')
                            } else {
                                console.error(err);
                                this.setState({
                                    isLoading: false,
                                    loadingMessage: '',
                                    loadingError: 'Error fetching account details'
                                })
                            }
                        }
                    )
                } else {
                    this.setState({
                        isLoading: false,
                        loadingMessage: '',
                        loadingError: 'Found no accounts!'
                    })
                }
            },
            err => {
                if (err.response && err.response.status === 401) {
                    this.redirect('/login')
                } else {
                    console.error(err);
                    this.setState({
                        isLoading: false,
                        loadingMessage: '',
                        loadingError: 'Failed to load accounts'
                    })
                }
            }
        )
    }

    renderAccountItem(account) {
        return (
            <div className="account-box">
                <div className="account-info">
                    <span className="account-name">{account.name}</span>
                    <span className="account-type">
                        {account.cashAccountType === 'CACC' ? 'CURRENT ACCOUNT' : account.cashAccountTypes}
                    </span>
                    <span className="account-id">{formatter.formatIBAN(account.accountId.iban)}</span>
                </div>
                <div className="account-amount">
                        <span className="account-balance-amount">
                            {formatter.formatAmount(+account.balances[0].balanceAmount.amount)}
                            </span>
                    <span className="account-balance-currency">{account.balances[0].balanceAmount.currency}</span>
                </div>
                {/*<div className="account-actions">
                    <button className="transactions-btn"
                            onClick={this.redirect.bind(this, `/transactions/${account.resourceId}`)}>
                        <i className="icofont icofont-exchange"/>TRANSACTIONS
                    </button>
                    <button className="transactions-btn"
                            onClick={this.redirect.bind(this, `/payment/${account.accountId.iban}`)}>
                        <i className="icofont icofont-exchange"/>PAYMENT
                    </button>
                </div>*/}
            </div>
        )
    }

    renderView() {
        return (
            <div id="account-info-container">
                <div className="wallet">
                    <h3>Wallet</h3>
                    <ul className="account-list">
                        {
                            this.accounts.map((account, index) => {
                                return (
                                    <li key={index}
                                        className="account-list-item"
                                        onClick={this.redirect.bind(this, `/transactions/${account.resourceId}`)}>
                                        {this.renderAccountItem(account)}
                                    </li>)
                            })
                        }
                    </ul>
                </div>
                <div id="main-menu">
                    <button className="active"
                            onClick={this.redirect.bind(this, `/accounts`)}>
                        <i className="icofont icofont-bank"/>
                        ACCOUNTS
                    </button>
                    <button
                        onClick={this.redirect.bind(this, {pathname: `/payment`, state: {accounts: this.accounts}})}>
                        <i className="icofont icofont-money"/>
                        TRANSFER
                    </button>
                </div>
            </div>
        )
    }

    redirect(path) {
        this.props.history.push(path);
    }

    render() {
        const {isLoading, loadingMessage, loadingError} = this.state;
        if (isLoading) {
            return <Spinner text={loadingMessage}/>
        } else if (loadingError) {
            return <div id="loadingError">{loadingError}</div>
        } else {
            return this.renderView()
        }
    }
}

AccountsView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};