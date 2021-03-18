import React from 'react'
import { shallow, mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import { of, throwError } from 'rxjs'
import TransactionsView from './transactions-view'
import Spinner from '../../components/spinner/spinner'
import { aispService } from '../../services/aisp/aisp'

const match = { params: { accountId: 'BE19001123456789EUR' } }

const createTransaction = (day, remittanceInformation, amount, currency) => {
	return {
		bookingDate: `1988-03-${day}`,
		remittanceInformation: { unstructured: [remittanceInformation] },
		transactionAmount: {
			amount,
			currency
		},
		entryReference: `ref-${day}`,
	}
}

describe('TransactionsView shallow', () => {

	it('should be loading', () => {
		const wrapper = shallow(<TransactionsView match={match} />)
		expect(wrapper.find(Spinner)).toHaveLength(1)
	})
})

describe('TransactionsView mounted', () => {
	let history

	beforeEach(() => {
		history = createMemoryHistory()
		history.push('/trx')
	})

	describe('Mount fail - getTransactions error', () => {
		beforeEach(() => jest.spyOn(aispService, 'getTransactions').mockImplementation(() => throwError('Failed to getTransactions')))

		afterEach(() => jest.restoreAllMocks())

		it('should show error div', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(wrapper.find('#loadingError').text()).toBe('Failed to load transactions!')
			expect(history.location.pathname).toBe('/trx')
		})
	})

	describe('Mount fail - getTransactions 401', () => {
		beforeEach(() => jest.spyOn(aispService, 'getTransactions').mockImplementation(() => throwError({ response: { status: 401 } })))

		afterEach(() => jest.restoreAllMocks())

		it('should redirect to login', () => {
			mount(<TransactionsView match={match} history={history} />)
			expect(history.location.pathname).toBe('/login')
		})
	})

	describe('Mount - No transactions', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getTransactions').mockImplementation(() => of([]))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should show empty list of transactions', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(history.location.pathname).toBe('/trx')
			expect(wrapper.find('h3').text()).toBe('BE19 0011 2345 6789')
			expect(wrapper.contains('no transactions found!')).toBe(true)
		})
	})

	describe('Mount - 5 transactions', () => {
		beforeEach(() => {
			jest.spyOn(aispService, 'getTransactions').mockImplementation(() => of([
				createTransaction(21, 'rem1', '11.449', 'EUR'),
				createTransaction(20, 'remit2', '2.449', 'EUR'),
				createTransaction(23, 'rem3', '111.449', 'EUR'),
				createTransaction(25, 'rem4', '4.449', 'USD'),
				createTransaction(24, 'remit5', '5.449', 'USD'),
			]))
		})

		afterEach(() => jest.restoreAllMocks())

		it('should show list of transactions', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(history.location.pathname).toBe('/trx')
			expect(wrapper.find('h3').text()).toBe('BE19 0011 2345 6789')
			expect(wrapper.find('.transactions-item')).toHaveLength(5)

			// createTransaction(25, 'rem4', '4.449', 'USD'),
			expect(wrapper.find('.transaction-day').first().text()).toBe('25')
			expect(wrapper.find('.transaction-month').first().text()).toBe('Mar')
			expect(wrapper.find('.transaction-remittance').first().text()).toBe('rem4')
			expect(wrapper.find('.transaction-reference').first().text()).toBe('ref-25')
			expect(wrapper.find('.transaction-amount').first().text()).toBe('4.45')
			expect(wrapper.find('.transaction-currency').first().text()).toBe('USD')

			// createTransaction(20, 'remit2', '2.449', 'EUR'),
			expect(wrapper.find('.transaction-day').last().text()).toBe('20')
			expect(wrapper.find('.transaction-month').last().text()).toBe('Mar')
			expect(wrapper.find('.transaction-remittance').last().text()).toBe('remit2')
			expect(wrapper.find('.transaction-reference').last().text()).toBe('ref-20')
			expect(wrapper.find('.transaction-amount').last().text()).toBe('2.45')
			expect(wrapper.find('.transaction-currency').last().text()).toBe('EUR')
		})

		it('should show search on remittance', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(wrapper.find('.transactions-item')).toHaveLength(5)

			const event = { target: { value: 'remi' } }
			wrapper.find('#searchField').simulate('change', event);

			expect(wrapper.find('.transactions-item')).toHaveLength(2)
		})

		it('should show search on entryReference', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(wrapper.find('.transactions-item')).toHaveLength(5)

			const event = { target: { value: 'ef-' } }
			wrapper.find('#searchField').simulate('change', event);

			expect(wrapper.find('.transactions-item')).toHaveLength(5)
		})

		it('should show search on amount', () => {
			const wrapper = mount(<TransactionsView match={match} history={history} />)
			expect(wrapper.find('.transactions-item')).toHaveLength(5)

			const event = { target: { value: '11' } }
			wrapper.find('#searchField').simulate('change', event);

			expect(wrapper.find('.transactions-item')).toHaveLength(2)
		})
	})
})

