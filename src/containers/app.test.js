import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import App from './app'

jest.mock('./landing-view/landing-view')
jest.mock('./login-view/login-view')
jest.mock('./payment-success-view/payment-success-view')
jest.mock('./payment-failure-view/payment-failure-view')
jest.mock('./payment-view/payment-view')
jest.mock('./accounts-view/accounts-view')
jest.mock('./transactions-view/transactions-view')

import LandingView from './landing-view/landing-view'
import LoginView from './login-view/login-view'
import PaymentSuccessView from './payment-success-view/payment-success-view'
import PaymentFailureView from './payment-failure-view/payment-failure-view'
import PaymentView from './payment-view/payment-view'
import AccountsView from './accounts-view/accounts-view'
import TransactionsView from './transactions-view/transactions-view'

const wrapApp = (url) => {
	return mount(
		<MemoryRouter initialEntries={[url]}>
			<App />
		</MemoryRouter>
	)
}

describe('App route', () => {
	beforeEach(() => {
		LandingView.mockImplementation(() => 'LandingViewMock')
		LoginView.mockImplementation(() => 'LoginViewMock')
		PaymentSuccessView.mockImplementation(() => 'PaymentSuccessViewMock')
		PaymentFailureView.mockImplementation(() => 'PaymentFailureViewMock')
		PaymentView.mockImplementation(() => 'PaymentViewMock')
		AccountsView.mockImplementation(() => 'AccountsViewMock')
	})
	afterEach(() => {
		jest.resetAllMocks()
	})
	it('should route to login view for unknown path', () => {
		const wrapper = wrapApp('/unknown')
		expect(wrapper.find(LoginView)).toHaveLength(1)
		expect(wrapper.find(LandingView)).toHaveLength(0)
	})

	it('should route to login view', () => {
		const wrapper = wrapApp('/login')
		expect(wrapper.find(LoginView)).toHaveLength(1)
		expect(wrapper.find(LandingView)).toHaveLength(0)
	})

	it('should route to payment success view', () => {
		const wrapper = wrapApp('/PaymentSuccess')
		expect(wrapper.find(LoginView)).toHaveLength(0)
		expect(wrapper.find(PaymentSuccessView)).toHaveLength(1)
	})

	it('should route to payment failure view', () => {
		const wrapper = wrapApp('/PaymentFailure')
		expect(wrapper.find(LoginView)).toHaveLength(0)
		expect(wrapper.find(PaymentFailureView)).toHaveLength(1)
	})

	it('should route to payment view', () => {
		const wrapper = wrapApp('/payment')
		expect(wrapper.find(LoginView)).toHaveLength(0)
		expect(wrapper.find(PaymentView)).toHaveLength(1)
	})

	it('should route to login for accounts / not authenticated', () => {
		const wrapper = wrapApp('/accounts')
		expect(wrapper.find(LoginView)).toHaveLength(1)
		expect(wrapper.find(AccountsView)).toHaveLength(0)
	})

	describe('Authenticated', () => {
		beforeEach(() => jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'dummy-token'))
		afterEach(() => Storage.prototype.getItem.mockRestore())

		it('should route to accounts view', () => {
			const wrapper = wrapApp('/accounts')
			expect(wrapper.find(LoginView)).toHaveLength(0)
			expect(wrapper.find(AccountsView)).toHaveLength(1)
		})

		it('should route to transactions view', () => {
			const wrapper = wrapApp('/transactions/123')
			expect(wrapper.find(LoginView)).toHaveLength(0)
			expect(wrapper.find(TransactionsView)).toHaveLength(1)
			expect(TransactionsView).toHaveBeenCalledWith(
				expect.objectContaining({
					match: expect.objectContaining({
						params: expect.objectContaining({
							accountId: '123'
						})
					})
				}), expect.anything()
			)
		})
	})

})