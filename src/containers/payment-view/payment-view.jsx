import * as React from 'react';
import * as PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { map, catchError } from 'rxjs/operators';

import { pispService } from "../../services/pisp/pisp";
import Spinner from "../../components/spinner/spinner";
import TextInput from "../../components/text-input/text-input";
import Select from "../../components/select/select";
import { formatter } from "../../helpers/formatter/formatter";

export default class PaymentView extends React.Component {

    constructor() {
        super();

        this.state = {
            isLoading: true,
            loadingMessage: '',
            loadingError: false,
            access_token: null,
            beneficiaryName: '',
            beneficiaryAccount: '',
            amount: '',
            remittanceInformation: '',
            debtorIBAN: null,
            paymentType: null,
            requestedExecutionDate: new Date(),
            frequency: null,
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
        this.paymentTypesOptions = Object.entries({
            'SEPA': 'SEPA',
            'SEPA-INST': 'Instant',
            'SEPA-FUTURE': 'Future',
            'SEPA-STO': 'Standing Order',
        }).map(([type, typeLabel]) => {
            return {
                label: typeLabel,
                value: type
            }
        })
        this.setState({ paymentType: this.paymentTypesOptions[0] })
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
        this.setState({ frequency: this.frequencyOptions[0] })
        this.accounts = this.props.location.state.accounts;
        this.authenticateClientSub = this.authenticateClient().subscribe()
    }

    authenticateClient() {
        this.setState({
            isLoading: true,
            loadingMessage: 'getting client token',
            loadingError: false
        });
        return pispService.authenticateClient().pipe(
            map(res => {
                this.setState({
                    isLoading: false,
                    loadingMessage: '',
                    loadingError: false,
                    access_token: res.access_token
                })
            }),
            catchError(err => {
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
            ))
    }

    makePayment() {
        const {
            access_token, beneficiaryName, beneficiaryAccount,
            amount, remittanceInformation, debtorIBAN, paymentType, 
            requestedExecutionDate, frequency, numberOfOccurrences,
            dayOfExecution,
        } = this.state;
        this.makePaymentSub = pispService.makePayment({
            access_token, beneficiaryName, beneficiaryAccount,
            amount, remittanceInformation, debtorAccount: debtorIBAN.value, paymentType: paymentType.value, 
            requestedExecutionDate: formatter.formatDate(requestedExecutionDate),
            frequency: frequency.value, numberOfOccurrences, dayOfExecution
        }).subscribe(
            consentURL => {
                window.location = consentURL
            }
        )
    }

    redirect(path) {
        this.props.history.push(path);
    }

    onFrequencyChange(frequency) {
        const freqValue = frequency.value
        let dayOfExecution = '01'
        if(!['WEEK', 'TOWK'].includes(freqValue)) {
            dayOfExecution = '31'
        }
        this.setState({
            dayOfExecution,
            frequency
        })
    }

    renderView() {
        const { paymentType, frequency, numberOfOccurrences, debtorIBAN, beneficiaryName, beneficiaryAccount, amount, remittanceInformation, requestedExecutionDate } = this.state;
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
                            label="TYPE *"
                            onChange={val => {
                                this.setState({
                                    paymentType: val
                                })
                            }}
                            options={this.paymentTypesOptions}
                            value={paymentType} />
                        <Select id="from-account"
                            label="FROM"
                            onChange={val => {
                                this.setState({
                                    debtorIBAN: val
                                })
                            }}
                            options={this.accounts.map(acc => {
                                return {
                                    label: `${formatter.formatIBAN(acc.accountId.iban)}   -   ( ${formatter.formatAmount(+acc.balances[0].balanceAmount.amount)}EUR )`,
                                    value: acc.accountId.iban
                                }
                            })}
                            value={debtorIBAN} 
                        />
                        {paymentType && ['SEPA-STO'].includes(paymentType.value) && (
                            <Select id="frequency"
                            label="FREQUENCY *"
                            onChange={this.onFrequencyChange}
                            options={this.frequencyOptions}
                            value={frequency} />
                        )}
                        {paymentType && ['SEPA-FUTURE', 'SEPA-STO'].includes(paymentType.value) && (
                            <div className="marvin-date-input">
                                <label htmlFor="requestedExecutionDate">Req. execution date *</label>
                                <DatePicker
                                    id="requestedExecutionDate"
                                    dateFormat="yyyy-MM-dd"
                                    selected={requestedExecutionDate}
                                    onChange={date => this.setState({ requestedExecutionDate: date })}
                                />
                            </div>
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
                            label="amount" />
                        <TextInput id="remittanceInformation"
                            required
                            value={remittanceInformation}
                            onChange={(val) => this.setState({ remittanceInformation: val })}
                            label="communication" />
                    </form>
                    <button className="make-payment-btn"
                        disabled={!debtorIBAN || debtorIBAN.value === '' || beneficiaryName === '' || beneficiaryAccount === '' || amount === '' || remittanceInformation === ''}
                        onClick={this.makePayment}>NEXT
                    </button>
                </div>
            </div>
        )
    }

    render() {
        const { isLoading, loadingMessage, loadingError } = this.state;
        if (isLoading) {
            return <Spinner text={loadingMessage} />
        } else if (loadingError) {
            return <div>error</div>
        } else {
            return this.renderView()
        }
    }

}

PaymentView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object
};
