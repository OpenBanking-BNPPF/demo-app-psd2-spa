import React, { useEffect, useState } from 'react'

import { aispService } from "../../services/aisp/aisp";
import { formatter } from "../../helpers/formatter/formatter";
import Spinner from "../../components/spinner/spinner";
import SearchBox from "../../components/search-box/search-box";
import { Highlight } from "../../components/highlight/highlight";
import { useNavigate, useParams } from 'react-router-dom';

const TransactionsView = () => {
    const navigate = useNavigate()
    const { accountId } = useParams();

    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [loadingError, setLoadingError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredItems, setFilteredItems] = useState([])
    const [transactions, setTransactions] = useState([])


    useEffect(() => {
        loadTransactions()
    }, [])


    const loadTransactions = () => {
        setIsLoading(true)
        setLoadingMessage('loading transactions')
        setLoadingError('')
        aispService.getTransactions(accountId).subscribe(
            trxs => {
                const transactions = trxs.sort((t1, t2) => t2.bookingDate.localeCompare(t1.bookingDate))
                setTransactions(transactions)
                setFilteredItems(transactions)

                setIsLoading(false)
                setLoadingMessage('')
            },
            err => {
                if (err.response && err.response.status === 401) {
                    navigate('/login')
                } else {
                    console.error(err)
                    setIsLoading(false)
                    setLoadingMessage('')
                    setLoadingError('Failed to load transactions!')
                }
            }
        )
    }

    const renderTransaction = (item) => {
        let remittanceInformation
        if (item.remittanceInformation.unstructured) {
            remittanceInformation = item.remittanceInformation.unstructured[0]
        }
        return (
            <div className="transactions-item">
                <div className="transaction-date">
                    <span className="transaction-day">{formatter.getDay(item.bookingDate)}</span>
                    <span className="transaction-month">{formatter.getMonth(item.bookingDate)}</span>
                </div>
                <div className="transaction-info">
                    <span className="transaction-remittance">
                        <Highlight textToHighlight={remittanceInformation}
                            termToHighlight={searchTerm} />
                    </span>
                    <span className="transaction-reference">
                        <Highlight textToHighlight={item.entryReference}
                            termToHighlight={searchTerm} />
                    </span>
                </div>
                <div className="transaction-value">
                    <span className="transaction-amount">
                        <Highlight textToHighlight={formatter.formatAmount(+item.transactionAmount.amount)}
                            termToHighlight={searchTerm} />
                    </span>
                    <span className="transaction-currency">{item.transactionAmount.currency}</span>
                </div>
            </div>
        )
    }

    const freeSearch = (term) => {
        setSearchTerm(term)
        if (term.trim() === '') {
            setFilteredItems(transactions)
        } else {
            const filteredItems = transactions.filter(
                item => {
                    return item.transactionAmount.amount.indexOf(term) > -1
                        || item.remittanceInformation.unstructured[0].toLowerCase().indexOf(term.toLowerCase()) > -1
                        || item.entryReference.toLowerCase().indexOf(term.toLowerCase()) > -1
                });
            setFilteredItems(filteredItems)
        }
    }

    const renderTransactions = () => {
        if (transactions && transactions.length > 0) {
            return (
                <div className="transactions-view">
                    <SearchBox value={searchTerm}
                        placeholder="filter transactions"
                        handleClear={() => {
                            setSearchTerm('')
                            setFilteredItems(transactions)
                        }}
                        handleChange={(e) => freeSearch(e.target.value)} />
                    <div className="my-transactions">
                        <i className="icofont icofont-exchange" />
                        My Transactions {` (${filteredItems.length})`}
                    </div>
                    <ul className="transaction-list">
                        {
                            filteredItems.map((item, index) => {
                                return (
                                    <li key={index}>
                                        {renderTransaction(item)}
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

    const renderContent = () => {
        if (isLoading) {
            return <Spinner text={loadingMessage} />
        } else if (loadingError) {
            return <div id="loadingError">{loadingError}</div>
        } else {
            return renderTransactions()
        }
    }

    const renderView = () => {
        return (
            <div id="transactions-container">
                <div className="box-content">
                    <div className="box-header">
                        <button className="back-btn" onClick={() => navigate('/accounts')}>
                            <i className="icofont icofont-reply"/>
                        </button>
                        <h3>
                            {formatter.formatIBAN(accountId.substring(0, accountId.length - 3))}
                        </h3>
                    </div>
                    {renderContent()}
                </div>
            </div>
        )
    }

    return renderView()
}

export default TransactionsView