import * as React from 'react';
import * as PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";

import { pispService } from "../../services/pisp/pisp";
import Spinner from "../../components/spinner/spinner";
import TextInput from "../../components/text-input/text-input";
import Select from "../../components/select/select";
import DateChooser from "../../components/date-picker/date-chooser";
import { formatter } from "../../helpers/formatter/formatter";

export default class PaymentView extends React.Component {

    constructor() {
        super();
        this.frequencyOptions = Object.entries({
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
        this.currencies = Object.entries({
            'EUR': 'Euro',
            'USD': 'US Dollar',
        }).map(([iso, label]) => {
            return {
                label: label,
                value: iso
            }
        })
        this.paymentTypesOptions = Object.entries({
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

        this.state = {
            isLoading: true,
            loadingMessage: '',
            loadingError: '',
            access_token: null,
            beneficiaryName: '',
            beneficiaryAccount: '',
            amount: '',
            currency: this.currencies[0],
            remittanceInformation: '',
            debtorIBAN: null,
            paymentType: this.paymentTypesOptions[0],
            requestedExecutionDate: null,
            frequency: this.frequencyOptions[0],
            numberOfOccurrences: '',
            dayOfExecution: '01',
        };
        this.makePayment = this.makePayment.bind(this)
        this.onFrequencyChange = this.onFrequencyChange.bind(this)
    }

    componentDidMount() {
        this.init()
    }

    componentWillUnmount() {
        if (this.authenticateClientSub) this.authenticateClientSub.unsubscribe()
        if (this.makePaymentSub) this.makePaymentSub.unsubscribe()
    }

    init() {
        this.initAccounts()
        this.authenticateClient()
    }

    initAccounts() {
        this.accounts = this.props.location.state.accounts;
        this.accountOptions = this.accounts.map(acc => {
            return {
                label: `${formatter.formatIBAN(acc.accountId.iban)}   -   ( ${formatter.formatAmount(+acc.balances[0].balanceAmount.amount)}EUR )`,
                value: acc.accountId.iban
            }
        })
        if (this.accountOptions.length === 1) {
            this.setState({debtorIBAN: this.accountOptions[0]})
        }
    }

    authenticateClient() {
        this.setState({
            isLoading: true,
            loadingMessage: 'getting client token',
            loadingError: ''
        });
        this.authenticateClientSub = pispService.authenticateClient().subscribe(
            res => {
                this.setState({
                    isLoading: false,
                    loadingMessage: '',
                    access_token: res.access_token
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
                        loadingError: 'Failed to Authenticate!'
                    })
                }
            }
        )
    }

    makePayment() {
        const {
            access_token, beneficiaryName, beneficiaryAccount,
            amount, remittanceInformation, debtorIBAN, paymentType,
            requestedExecutionDate, frequency, numberOfOccurrences,
            dayOfExecution, currency,
        } = this.state;
        this.makePaymentSub = pispService.makePayment({
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
                this.props.history.push('/PaymentFailure')
            }
        )
    }

    redirect(path) {
        this.props.history.push(path);
    }

    onFrequencyChange(frequency) {
        const freqValue = frequency.value
        let dayOfExecution = '01'
        if (!['WEEK', 'TOWK'].includes(freqValue)) {
            dayOfExecution = '31'
        }
        this.setState({
            dayOfExecution,
            frequency
        })
    }

    renderView() {
        const { paymentType, currency, frequency, numberOfOccurrences, debtorIBAN, beneficiaryName, beneficiaryAccount, amount, remittanceInformation, requestedExecutionDate } = this.state;
        return (
            <div id="payment-container">
                <div className="box-content">
                    <div className="box-header">
                        <button className="back-btn"
                            onClick={this.redirect.bind(this, '/accounts')}><i
                                className="icofont icofont-reply" /></button>
                        <h3>NEW TRANSFER</h3>
                    </div>
                    <form className="payment-form">
                        <Select id="payment-type"
                            label="Type"
                            required
                            onChange={val => {
                                this.setState({paymentType: val, currency: this.currencies[0], requestedExecutionDate: null})
                            }}
                            options={this.paymentTypesOptions}
                            value={paymentType} />
                        <Select id="from-account"
                            label="From"
                            required
                            onChange={val => {
                                this.setState({
                                    debtorIBAN: val
                                })
                            }}
                            options={this.accountOptions}
                            value={debtorIBAN}
                        />
                        {paymentType && ['SEPA-STO'].includes(paymentType.value) && (
                            <Select id="frequency"
                                label="Frequency"
                                required
                                onChange={this.onFrequencyChange}
                                options={this.frequencyOptions}
                                value={frequency} />
                        )}
                        {paymentType && ['SEPA-FUTURE', 'SEPA-STO'].includes(paymentType.value) && (
                            <DateChooser id="requestedExecutionDate"
                                value={requestedExecutionDate}
                                required
                                onChange={(date) => {this.setState({ requestedExecutionDate: date })}}
                                dateFormat="yyyy-MM-dd"
                                label="Request execution date" />
                        )}
                        {paymentType && ['SEPA-STO'].includes(paymentType.value) && (
                            <TextInput id="numberOfOccurrences"
                                value={numberOfOccurrences}
                                type="number"
                                required
                                onChange={(val) => this.setState({ numberOfOccurrences: val })}
                                label="#occurences" />
                        )}
                        <TextInput id="beneficiary-name"
                            value={beneficiaryName}
                            required
                            onChange={(val) => this.setState({ beneficiaryName: val })}
                            label="beneficiary name" />
                        <TextInput id="beneficiary-account"
                            value={beneficiaryAccount}
                            required
                            onChange={(val) => this.setState({ beneficiaryAccount: val })}
                            label="beneficiary account" />
                        <TextInput id="amount"
                            value={amount}
                            required
                            type="number"
                            onChange={(val) => this.setState({ amount: val })}
                            label={`amount${paymentType && ['INTP'].includes(paymentType.value) ? '' : ' in euro'}`} />
                        {paymentType && ['INTP'].includes(paymentType.value) && (
                            <Select id="currency"
                                label="Currency"
                                required
                                onChange={val => {
                                    this.setState({
                                        currency: val
                                    })
                                }}
                                options={this.currencies}
                                value={currency} />
                        )}
                        <TextInput id="remittanceInformation"
                            required
                            value={remittanceInformation}
                            onChange={(val) => this.setState({ remittanceInformation: val })}
                            label="communication" />
                    </form>
                    <button className="make-payment-btn"
                        disabled={this.isNextButtonDisabled()}
                        onClick={this.makePayment}>NEXT
                    </button>
                </div>
            </div>
        )
    }

    isNextButtonDisabled() {
        const { paymentType, frequency, numberOfOccurrences, debtorIBAN, beneficiaryName, beneficiaryAccount, amount, remittanceInformation, requestedExecutionDate } = this.state;
        let isDisbaled = !debtorIBAN || debtorIBAN.value === '' || beneficiaryName === '' || beneficiaryAccount === '' || amount === '' || remittanceInformation === ''
        if (['SEPA-FUTURE', 'SEPA-STO'].includes(paymentType.value)) {
            isDisbaled = (isDisbaled || !requestedExecutionDate || requestedExecutionDate === '')
        }
        if (['SEPA-STO'].includes(paymentType.value)) {
            isDisbaled = (isDisbaled || frequency === '' || numberOfOccurrences === '')
        }
        return isDisbaled
    }

    render() {
        const { isLoading, loadingMessage, loadingError } = this.state;
        if (isLoading) {
            return <Spinner text={loadingMessage} />
        } else if (loadingError) {
            return <div id="loadingError">{loadingError}</div>
        } else {
            return this.renderView()
        }
    }

}

PaymentView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};
