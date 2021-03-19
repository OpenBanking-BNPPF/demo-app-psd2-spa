import React from 'react'
import { shallow, mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { of, throwError } from 'rxjs'
import PaymentView from './payment-view'
import Spinner from '../../components/spinner/spinner'
import { pispService } from '../../services/pisp/pisp'

describe('PaymentView shallow', () => {
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

describe('PaymentView mounted failures', () => {

	describe('Mount fail - Authenticate error', () => {
		beforeEach(() => jest.spyOn(pispService, 'authenticateClient').mockImplementation(() => throwError('Failed to authenticate client')))

		afterEach(() => jest.restoreAllMocks())

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

		afterEach(() => jest.restoreAllMocks())

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
		jest.spyOn(pispService, 'authenticateClient').mockImplementation(() => of({ access_token: 'access-token' }))
	})
	afterEach(() => jest.restoreAllMocks())

	it('should render initial screen', () => {
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
	})

	it('should allow SEPA payments', () => {
		const match = {}
		const accounts = createAccounts()
		const location = { state: { accounts } }
		const history = createMemoryHistory();
		const wrapper = mount(<PaymentView location={location} match={match} history={history} />)

		// Fill Payment fields
		wrapper.setState({ debtorIBAN: wrapper.instance().accountOptions[0] })
		wrapper.setState({ beneficiaryName: 'Benoit' })
		wrapper.setState({ beneficiaryAccount: 'BE19001288306543' })
		wrapper.setState({ amount: '2.1' })
		wrapper.setState({ remittanceInformation: 'SEPA for testing' })

		// Verify button enabled 
		expect(wrapper.find('.make-payment-btn').props().disabled).toBe(false)

	})
})
