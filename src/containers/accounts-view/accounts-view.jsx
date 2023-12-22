import React, { useEffect, useState  } from 'react'
import { useNavigate } from 'react-router-dom'

import { aispService } from "../../services/aisp/aisp"
import { apiService } from "../../services/apis/apis"
import { formatter } from "../../helpers/formatter/formatter"
import Spinner from "../../components/spinner/spinner"

const AccountsView = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [loadingError, setLoadingError] = useState('')
    const [accounts, setAccounts] = useState([])

    useEffect(() => loadAccountsInfo(), [])

    const loadAccountsInfo = () => {
        setIsLoading(true)
        setLoadingMessage('loading accounts information')
        setLoadingError('')
        aispService.getAccounts().subscribe(
            accounts => {
                const requests = [];
                if (accounts && accounts.length > 0) {
                    accounts.forEach(account => {
                        requests.push(
                            aispService.getAccountDetails(account)
                        )
                    })
                    apiService.concatRequests(...requests).subscribe(
                        accountsDetails => {
                            setAccounts(accountsDetails)
                            setIsLoading(false)
                            setLoadingMessage('')
                        },
                        err => {
                            if (err.response && err.response.status === 401) {
                                redirect('/login')
                            } else {
                                console.error(err);
                                setIsLoading(false)
                                setLoadingMessage('')
                                setLoadingError('Error fetching account details')
                            }
                        }
                    )
                } else {
                    setIsLoading(false)
                    setLoadingMessage('')
                    setLoadingError('Found no accounts!')
                }
            },
            err => {
                if (err.response && err.response.status === 401) {
                    redirect('/login')
                } else {
                    console.error(err);
                    setIsLoading(false)
                    setLoadingMessage('')
                    setLoadingError('Failed to load accounts')
                }
            }
        )
    }

    const renderAccountItem = (account) => {
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

    const renderView = () => {
        return (
            <div id="account-info-container">
                <div className="wallet">
                    <h3>Wallet</h3>
                    <ul className="account-list">
                        {
                            accounts.map((account, index) => {
                                return (
                                    <li key={index}
                                        className="account-list-item"
                                        onClick={() => redirect(`/transactions/${account.resourceId}`)}>
                                        {renderAccountItem(account)}
                                    </li>)
                            })
                        }
                    </ul>
                </div>
                <div id="main-menu">
                    <button className="active"
                            onClick={() => redirect(`/accounts`)}>
                        <i className="icofont icofont-bank"/>
                        ACCOUNTS
                    </button>
                    <button
                        onClick={() => redirect({pathname: `/payment`, state: {accounts: this.accounts}})}>
                        <i className="icofont icofont-money"/>
                        TRANSFER
                    </button>
                </div>
            </div>
        )
    }

    const redirect = (path) => {
        navigate(path)
    }

    const render = () => {
        if (isLoading) {
            return <Spinner text={loadingMessage}/>
        } else if (loadingError) {
            return <div id="loadingError">{loadingError}</div>
        } else {
            return renderView()
        }
    }

    return render()
}


export default AccountsView