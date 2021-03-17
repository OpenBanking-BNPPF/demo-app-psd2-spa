import React from 'react'
import { shallow, mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { of, throwError } from 'rxjs'
import AccountsView from './accounts-view'
import Spinner from '../../components/spinner/spinner'
import { aispService } from '../../services/aisp/aisp'


describe('AccountsView shallow', () => {
	it('should be loading', () => {
		const wrapper = shallow(<AccountsView />)
		expect(wrapper.find(Spinner)).toHaveLength(1)
	})
})

describe('AccountsView mounted', () => {

	describe('Mount fail - getAccounts error', () => {
		beforeEach(() => jest.spyOn(aispService, 'getAccounts').mockImplementation(() => throwError('Failed to getAccounts')))

		afterEach(() => jest.restoreAllMocks())

		it('should show error div', () => {
			const match = {}
			const history = createMemoryHistory();
			const wrapper = mount(<AccountsView match={match} history={history} />)
			expect(wrapper.find('#loadingError').text()).toBe('Failed to load accounts')
		})
	})

	describe('Mount fail - getAccounts 401', () => {
		beforeEach(() => jest.spyOn(aispService, 'getAccounts').mockImplementation(() => throwError({ response: { status: 401 } })))

		afterEach(() => jest.restoreAllMocks())

		it('should redirect to login', () => {
			const match = {}
			const history = createMemoryHistory();
			mount(<AccountsView match={match} history={history} />)
			expect(history.location.pathname).toBe('/login')
		})
	})

	describe('Mount - No accounts', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getAccounts').mockImplementation(() => of([]))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should show error - Found no accounts!', () => {
			const match = {}
			const history = createMemoryHistory();
			const wrapper = mount(<AccountsView match={match} history={history} />)
			expect(wrapper.find('#loadingError').text()).toBe('Found no accounts!')
		})
	})

	describe('Mount fail - getAccountDetails error', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getAccounts').mockImplementation(() => of(['BE19001123456789', 'BE19001123456780']))
			jest.spyOn(aispService, 'getAccountDetails').mockImplementation(() => throwError('Could not load details'))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should show error div', () => {
			const match = {}
			const history = createMemoryHistory();
			const wrapper = mount(<AccountsView match={match} history={history} />)
			expect(wrapper.find('#loadingError').text()).toBe('Error fetching account details')
		})
	})

	describe('Mount fail - getAccountDetails 401', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getAccounts').mockImplementation(() => of(['BE19001123456789', 'BE19001123456780']))
			jest.spyOn(aispService, 'getAccountDetails').mockImplementation(() => throwError({ response: { status: 401 } }))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should redirect to login', () => {
			const match = {}
			const history = createMemoryHistory();
			mount(<AccountsView match={match} history={history} />)
			expect(history.location.pathname).toBe('/login')
		})
	})

	describe('Mount - with accounts', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getAccounts').mockImplementation(() => of(['BE19001123456789', 'BE19001123456780']))
			jest.spyOn(aispService, 'getAccountDetails').mockImplementation(iban => of({
				accountId: { iban: iban },
				balances: [
					{ balanceAmount: { amount: 10.455, currency: 'EUR' } },
					{ balanceAmount: { amount: 20, currency: 'EUR' } },
					{ balanceAmount: { amount: 30, currency: 'EUR' } }
				],
				transactions: [],
			}))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should render accountList', () => {
			const match = {}
			const history = createMemoryHistory();
			const wrapper = mount(<AccountsView match={match} history={history} />)
			expect(wrapper.find('.account-list-item')).toHaveLength(2)
			expect(wrapper.find('.account-id').first().text()).toBe('BE19 0011 2345 6789')
			expect(wrapper.find('.account-id').last().text()).toBe('BE19 0011 2345 6780')

			expect(wrapper.find('.account-balance-amount').first().text()).toBe('10.46')
			expect(wrapper.find('.account-balance-amount').last().text()).toBe('10.46')

			expect(wrapper.find('.account-balance-currency').first().text()).toBe('EUR')
			expect(wrapper.find('.account-balance-currency').last().text()).toBe('EUR')
		})
	})

	describe('Unmount', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getAccounts').mockImplementation(() => of(['BE19001123456789', 'BE19001123456780']))
			jest.spyOn(aispService, 'getAccountDetails').mockImplementation(iban => of({
				accountId: { iban: iban },
				balances: [
					{ balanceAmount: { amount: 10.455, currency: 'EUR' } },
					{ balanceAmount: { amount: 20, currency: 'EUR' } },
					{ balanceAmount: { amount: 30, currency: 'EUR' } }
				],
				transactions: [],
			}))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should unsubscribe', () => {
			const match = {}
			const history = createMemoryHistory();
			const wrapper = mount(<AccountsView match={match} history={history} />)
			wrapper.unmount()
		})
	})
})