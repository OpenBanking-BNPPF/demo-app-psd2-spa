import * as React from 'react';
import PropTypes from 'prop-types';

import { aispService } from "../../services/aisp/aisp";
import { formatter } from "../../helpers/formatter/formatter";
import Spinner from "../../components/spinner/spinner";
import SearchBox from "../../components/search-box/search-box";
import { Highlight } from "../../components/highlight/highlight";

export default class TransactionsView extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            loadingMessage: '',
            loadingError: false,
            searchTerm: '',
            filteredItems: [],
        }
    }

    componentWillUnmount() {
        if (this.getTransactionsSub) this.getTransactionsSub.unsubscribe();
    }

    componentWillMount() {
        this.accountId = this.props.match.params.accountId;
        this.init()
    }

    init() {
        this.loadTransactions()
    }

    loadTransactions() {
        this.setState({
            isLoading: true,
            loadingMessage: 'loading transactions',
            loadingError: false
        });
        this.getTransactionsSub = aispService.getTransactions(this.accountId).subscribe(
            transactions => {
                this.transactions = transactions;
                this.transactions.sort((t1, t2) => t2.bookingDate.localeCompare(t1.bookingDate));
                this.setState({filteredItems: this.transactions});

                this.setState({
                    isLoading: false,
                    loadingMessage: '',
                    loadingError: false
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
                        loadingError: true
                    })
                }
            }
        )
    }

    redirect(path) {
        this.props.history.push(path);
    }

    renderTransaction(item) {
        const {searchTerm} = this.state;
        return (
            <div className="transactions-item">
                <div className="transaction-date">
                    <span className="transaction-day">{formatter.getDay(item.bookingDate)}</span>
                    <span className="transaction-month">{formatter.getMonth(item.bookingDate)}</span>
                </div>
                <div className="transaction-info">
                    <span className="transaction-remittance">
                        <Highlight textToHighlight={item.remittanceInformation[0]}
                                   termToHighlight={searchTerm}/>
                        </span>
                    <span className="transaction-reference">
                        <Highlight textToHighlight={item.entryReference}
                                   termToHighlight={searchTerm}/>
                        </span>
                </div>
                <div className="transaction-value">
                    <span className="transaction-amount">
                        <Highlight textToHighlight={formatter.formatAmount(+item.transactionAmount.amount)}
                                   termToHighlight={searchTerm}/>
                        </span>
                    <span className="transaction-currency">{item.transactionAmount.currency}</span>
                </div>
            </div>
        )
    }

    freeSearch(term) {
        this.setState({
            searchTerm: term
        });
        if (term.trim() === '') {
            this.setState({filteredItems: this.transactions});
        } else {
            const filteredItems = this.transactions.filter(
                item => {
                    return item.transactionAmount.amount.indexOf(term) > -1
                        || item.remittanceInformation[0].toLowerCase().indexOf(term.toLowerCase()) > -1
                        || item.entryReference.toLowerCase().indexOf(term.toLowerCase()) > -1
                });
            this.setState({filteredItems: filteredItems});
        }
    }

    renderTransactions() {
        const {filteredItems, searchTerm} = this.state;
        if (this.transactions && this.transactions.length > 0) {
            return (
                <div className="transactions-view">
                    <SearchBox value={searchTerm}
                               placeholder="filter transactions"
                               handleClear={() => this.setState({
                                   searchTerm: '',
                                   filteredItems: this.transactions
                               })}
                               handleChange={(e) => this.freeSearch(e.target.value)}/>
                    <div className="my-transactions">
                        <i className="icofont icofont-exchange"/>
                        My Transactions {` (${filteredItems.length})`}
                    </div>
                    <ul className="transaction-list">
                        {
                            filteredItems.map((item, index) => {
                                return (
                                    <li key={index}>
                                        {this.renderTransaction(item)}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        } else {
            return 'no transactions found!'
        }
    }

    renderContent() {
        const {isLoading, loadingMessage, loadingError} = this.state;
        if (isLoading) {
            return <Spinner text={loadingMessage}/>
        } else if (loadingError) {
            return <div>error</div>
        } else {
            return this.renderTransactions()
        }
    }

    renderView() {
        return (
            <div id="transactions-container">
                <div className="box-content">
                    <div className="box-header">
                        <button className="back-btn" onClick={this.redirect.bind(this, '/accounts')}><i
                            className="icofont icofont-reply"/>back</button>
                        <h3>
                            {formatter.formatIBAN(this.accountId.substring(0, this.accountId.length - 3))}
                        </h3>
                    </div>
                    {this.renderContent()}
                </div>
            </div>
        )
    }

    render() {
        return this.renderView()
    }
}
TransactionsView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};
