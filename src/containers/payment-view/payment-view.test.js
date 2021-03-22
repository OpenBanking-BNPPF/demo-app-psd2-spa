import React from 'react'
import { shallow, mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { of, throwError } from 'rxjs'
import moment from 'moment'
import PaymentView from './payment-view'
import Spinner from '../../components/spinner/spinner'
import { pispService } from '../../services/pisp/pisp'


const setInputValue = (wrapper, id, value) => {
	wrapper.find(id).find('input').simulate('change', { target: { value: value } })
}

describe('PaymentView shallow', () => {
	beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()))
	afterEach(() => jest.restoreAllMocks())

	it('should be loading', () => {
		const match = {}
		const location = {
			state: {
				accounts: []
			}
		}
		const wrapper = shallow(<PaymentView match={match} location={location} />)
		expect(wrapper.find(Spinner)).toHaveLength(1)
	})
})

describe('PaymentView unmount', () => {
	beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()))
	afterEach(() => jest.restoreAllMocks())

	it('should be unmounting', () => {
		const match = {}
		const location = {
			state: {
				accounts: []
			}
		}
		const wrapper = shallow(<PaymentView match={match} location={location} />)
		wrapper.unmount()
	})
})

describe('PaymentView mounted failures', () => {
	beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()))
	afterEach(() => jest.restoreAllMocks())

	describe('Mount fail - Authenticate error', () => {
		beforeEach(() => jest.spyOn(pispService, 'authenticateClient').mockImplementation(() => throwError('Failed to authenticate client')))

		it('should show error div', () => {
			const match = {}
			const location = {
				state: {
					accounts: []
				}
			}
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)
			expect(wrapper.find('#loadingError').text()).toBe('Failed to Authenticate!')
		})
	})

	describe('Mount fail - Authenticate 401', () => {
		beforeEach(() => jest.spyOn(pispService, 'authenticateClient').mockImplementation(() => throwError({ response: { status: 401 } })))

		it('should redirect to login', () => {
			const match = {}
			const location = {
				state: {
					accounts: []
				}
			}
			const history = createMemoryHistory();
			mount(<PaymentView location={location} match={match} history={history} />)
			expect(history.location.pathname).toBe('/login')
		})
	})
})

const createAccounts = () => {
	return [
		{
			accountId: { iban: 'BE19001123456789' },
			balances: [
				{ balanceAmount: { amount: 10.455, currency: 'EUR' } },
				{ balanceAmount: { amount: 20, currency: 'EUR' } },
				{ balanceAmount: { amount: 30, currency: 'EUR' } }
			],
			transactions: [],
		}
	]
}

describe('PaymentView mounted', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(jest.fn())
		jest.spyOn(pispService, 'authenticateClient').mockImplementation(() => of({ access_token: 'access-token' }))
	})
	afterEach(() => jest.restoreAllMocks())

	it('should render initial screen and back', () => {
		const match = {}
		const location = {
			state: {
				accounts: createAccounts()
			}
		}
		const history = createMemoryHistory();
		const wrapper = mount(<PaymentView location={location} match={match} history={history} />)
		expect(wrapper.find('h3').text()).toBe('NEW TRANSFER')
		expect(wrapper.find('#payment-type').find('.marvin-select-selected-item').first().text()).toBe('SEPA')
		expect(wrapper.find('.make-payment-btn').props().disabled).toBe(true)
		wrapper.find('.back-btn').at(0).simulate('click')
		expect(history.location.pathname).toBe('/accounts')
	})

	describe('Payment execution - Failure', () => {
		beforeEach(() => {
			jest.spyOn(pispService, 'makePayment').mockImplementation(() => {
				return {
					subscribe: (succ, err) => {
						err('Payment failed!!!')
					}
				}
			})
		})

		it('should redirect to failure view', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			setInputValue(wrapper, '#beneficiary-name', 'Benoit')
			setInputValue(wrapper, '#beneficiary-account', 'BE19001288306543')
			setInputValue(wrapper, '#amount', '2.1')
			setInputValue(wrapper, '#remittanceInformation', 'SEPA for testing')

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(history.location.pathname).toBe('/PaymentFailure')
		})
	})


	describe('Payment execution - Success', () => {
		beforeEach(() => {
			delete window.location
			window.location = {
				href: '',
			}
			jest.spyOn(pispService, 'makePayment').mockImplementation(() => {
				return {
					subscribe: (succ) => {
						succ('http://payment-was-success')
					}
				}
			})
		})
		afterEach(() => {
			window.location = location
		})

		it('should allow SEPA payments', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			setInputValue(wrapper, '#beneficiary-name', 'Benoit')
			setInputValue(wrapper, '#beneficiary-account', 'BE19001288306543')
			setInputValue(wrapper, '#amount', '2.1')
			setInputValue(wrapper, '#remittanceInformation', 'SEPA for testing')

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(window.location).toBe('http://payment-was-success')
		})

		it('should allow Instant payments', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ paymentType: wrapper.instance().paymentTypesOptions[1] })
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			setInputValue(wrapper, '#beneficiary-name', 'Benoit')
			setInputValue(wrapper, '#beneficiary-account', 'BE19001288306543')
			setInputValue(wrapper, '#amount', '2.1')
			setInputValue(wrapper, '#remittanceInformation', 'Instant for testing')

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(window.location).toBe('http://payment-was-success')
		})

		it('should allow Future payments', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ paymentType: wrapper.instance().paymentTypesOptions[2] })
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			setInputValue(wrapper, '#beneficiary-name', 'Benoit')
			setInputValue(wrapper, '#beneficiary-account', 'BE19001288306543')
			setInputValue(wrapper, '#amount', '2.1')
			setInputValue(wrapper, '#remittanceInformation', 'Future for testing')
			wrapper.setState({ requestedExecutionDate: moment().add(1, 'd').toDate() })

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(window.location).toBe('http://payment-was-success')
		})

		it('should allow STO payments', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ paymentType: wrapper.instance().paymentTypesOptions[3] })
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			wrapper.setState({ frequency: wrapper.instance().frequencyOptions[0] })
			setInputValue(wrapper, '#beneficiary-name', 'Benoit')
			setInputValue(wrapper, '#beneficiary-account', 'BE19001288306543')
			setInputValue(wrapper, '#amount', '2.5')
			setInputValue(wrapper, '#numberOfOccurrences', '5')
			setInputValue(wrapper, '#remittanceInformation', 'STO for testing')
			wrapper.setState({ requestedExecutionDate: moment().add(5, 'd').toDate() })

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(window.location).toBe('http://payment-was-success')
		})

		it('should allow International payments', () => {
			const match = {}
			const accounts = createAccounts()
			const location = { state: { accounts } }
			const history = createMemoryHistory();
			const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

			// Fill Payment fields
			wrapper.setState({ paymentType: wrapper.instance().paymentTypesOptions[4] })
			wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
			wrapper.setState({ beneficiaryName: 'Benoit' })
			wrapper.setState({ beneficiaryAccount: 'BE19001288306543' })
			wrapper.setState({ amount: '2.5' })
			wrapper.setState({ currency: 'USD' })
			wrapper.setState({ remittanceInformation: 'INTP for testing' })

			// Verify button enabled 
			expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

			// Make payment + verify
			wrapper.find('.make-payment-btn').simulate('click')

			expect(pispService.makePayment).toHaveBeenCalledTimes(1)
			expect(window.location).toBe('http://payment-was-success')
		})
	})
})
