import React, { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css"

import { pispService } from "../../services/pisp/pisp"
import Spinner from "../../components/spinner/spinner"
import TextInput from "../../components/text-input/text-input"
import Select from "../../components/select/select"
import DateChooser from "../../components/date-picker/date-chooser"
import { formatter } from "../../helpers/formatter/formatter"
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentView = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [loadingError, setLoadingError] = useState('')
    const [access_token, set_access_token] = useState()
    const [beneficiaryName, setBeneficiaryName] = useState('')
    const [beneficiaryAccount, setBeneficiaryAccount] = useState('')
    const [remittanceInformation, setRemittanceInformation] = useState('')
    const [amount, setAmount] = useState('')
    const [debtorIBAN, setDebtorIBAN] = useState()
    const [requestedExecutionDate, setRequestedExecutionDate] = useState()
    const [numberOfOccurrences, setNumberOfOccurrences] = useState('')
    const [dayOfExecution, setDayOfExecution] = useState('01')
    const [currency, setCurrency] = useState(currencies[0])
    const [paymentType, setPaymentType] = useState(paymentTypesOptions[0])
    const [frequency, setFrequency] = useState(frequencyOptions[0])
    const [accounts, setAccounts] = useState([])
    const [accountOptions, setAccountOptions] = useState([])

    useEffect(() => {
        authenticateClient()
    }, [])

    useEffect(() => {
        initAccounts()
    }, [])

    const initAccounts = () => {
        const accounts = location.state.accounts
        const accountOptions = accounts.map(acc => {
            return {
                label: `${formatter.formatIBAN(acc.accountId.iban)}   -   ( ${formatter.formatAmount(+acc.balances[0].balanceAmount.amount)}EUR )`,
                value: acc.accountId.iban
            }
        })
        if (accountOptions.length === 1) {
            setDebtorIBAN(accountOptions[0])
        }
        setAccounts(accounts)
        setAccountOptions(accountOptions)
    }

    const authenticateClient = () => {
        setIsLoading(true)
        setLoadingMessage('getting client token')
        setLoadingError('')
        
        pispService.authenticateClient().subscribe(
            res => {
                setIsLoading(false)
                setLoadingMessage('')
                set_access_token(res.access_token)
            },
            err => {
                if (err.response && err.response.status === 401) {
                    navigate('/login')
                } else {
                    console.error(err)
                    setIsLoading(false)
                    setLoadingMessage('')
                    setLoadingError('Failed to Authenticate!')
                }
            }
        )
    }

    const makePayment = () => {
        pispService.makePayment({
            access_token, beneficiaryName, beneficiaryAccount,
            amount, remittanceInformation, debtorAccount: debtorIBAN.value, paymentType: paymentType.value, currency: currency.value,
            requestedExecutionDate: formatter.formatDate(requestedExecutionDate),
            frequency: frequency.value, numberOfOccurrences, dayOfExecution
        }).subscribe(
            consentURL => {
                window.location = consentURL
            },
            err => {
                console.error(err)
                navigate('/PaymentFailure', {state: {message: err.response}})
            }
        )
    }

    const onFrequencyChange =(frequency) => {
        const freqValue = frequency.value
        let dayOfExecution = '01'
        if (!['WEEK', 'TOWK'].includes(freqValue)) {
            dayOfExecution = '31'
        }
        setDayOfExecution(dayOfExecution)
        setFrequency(frequency)
    }

    const renderView= () => {
        return (
            <div id="payment-container">
                <div className="box-content">
                    <div className="box-header">
                        <button className="back-btn"
                            onClick={() => navigate('/accounts')}><i
                                className="icofont icofont-reply" /></button>
                        <h3>NEW TRANSFER</h3>
                    </div>
                    <form className="payment-form">
                        <Select id="payment-type"
                            label="Type"
                            required
                            onChange={val => {
                                setPaymentType(val)
                                setCurrency(currencies[0])
                                setRequestedExecutionDate(null)
                            }}
                            options={paymentTypesOptions}
                            value={paymentType} />
                        <Select id="from-account"
                            label="From"
                            required
                            onChange={val => setDebtorIBAN(val)}
                            options={accountOptions}
                            value={debtorIBAN}
                        />
                        {paymentType && ['SEPA-STO'].includes(paymentType.value) && (
                            <Select id="frequency"
                                label="Frequency"
                                required
                                onChange={onFrequencyChange}
                                options={frequencyOptions}
                                value={frequency} />
                        )}
                        {paymentType && ['SEPA-FUTURE', 'SEPA-STO'].includes(paymentType.value) && (
                            <DateChooser id="requestedExecutionDate"
                                value={requestedExecutionDate}
                                required
                                onChange={date => setRequestedExecutionDate(date)}
                                dateFormat="yyyy-MM-dd"
                                label="Request execution date" />
                        )}
                        {paymentType && ['SEPA-STO'].includes(paymentType.value) && (
                            <TextInput id="numberOfOccurrences"
                                value={numberOfOccurrences}
                                type="number"
                                required
                                onChange={val=> setNumberOfOccurrences(val)}
                                label="#occurences" />
                        )}
                        <TextInput id="beneficiary-name"
                            value={beneficiaryName}
                            required
                            onChange={(val) => setBeneficiaryName(val)}
                            label="beneficiary name" />
                        <TextInput id="beneficiary-account"
                            value={beneficiaryAccount}
                            required
                            onChange={(val) => setBeneficiaryAccount(val)}
                            label="beneficiary account" />
                        <TextInput id="amount"
                            value={amount}
                            required
                            type="number"
                            onChange={(val) => setAmount(val)}
                            label={`amount${paymentType && ['INTP'].includes(paymentType.value) ? '' : ' in euro'}`} />
                        {paymentType && ['INTP'].includes(paymentType.value) && (
                            <Select id="currency"
                                label="Currency"
                                required
                                onChange={val => setCurrency(val)}
                                options={currencies}
                                value={currency} />
                        )}
                        <TextInput id="remittanceInformation"
                            required
                            value={remittanceInformation}
                            onChange={(val) => setRemittanceInformation(val)}
                            label="communication" />
                    </form>
                    <button className="make-payment-btn"
                        disabled={isNextButtonDisabled()}
                        onClick={makePayment}>
                            NEXT
                    </button>
                </div>
            </div>
        )
    }

    const isNextButtonDisabled = () => {
        let isDisbaled = !debtorIBAN || debtorIBAN.value === '' || beneficiaryName === '' || beneficiaryAccount === '' || amount === '' || remittanceInformation === ''
        if (['SEPA-FUTURE', 'SEPA-STO'].includes(paymentType.value)) {
            isDisbaled = (isDisbaled || !requestedExecutionDate || requestedExecutionDate === '')
        }
        if (['SEPA-STO'].includes(paymentType.value)) {
            isDisbaled = (isDisbaled || frequency === '' || numberOfOccurrences === '')
        }
        return isDisbaled
    }

    const render = () => {
        if (isLoading) {
            return <Spinner text={loadingMessage} />
        } else if (loadingError) {
            return <div id="loadingError">{loadingError}</div>
        } else {
            return renderView()
        }
    }

    return render()

}

const frequencyOptions = Object.entries({
    'WEEK': 'Weekly',
    'TOWK': 'Every 2 weeks',
    'MNTH': 'Monthly',
    'TOMN': 'Every 2 months',
    'QUTR': 'Quarterly',
    'SEMI': 'Every 6 months',
    'YEAR': 'Yearly',
}).map(([type, typeLabel]) => {
    return {
        label: typeLabel,
        value: type
    }
})

const currencies = Object.entries({
    'EUR': 'Euro',
    'USD': 'US Dollar',
}).map(([iso, label]) => {
    return {
        label: label,
        value: iso
    }
})

const paymentTypesOptions = Object.entries({
    'SEPA': 'SEPA',
    'SEPA-INST': 'Instant',
    'SEPA-FUTURE': 'Future',
    'SEPA-STO': 'Standing Order',
    'INTP': 'International payment',
}).map(([type, typeLabel]) => {
    return {
        label: typeLabel,
        value: type
    }
})

export default PaymentView