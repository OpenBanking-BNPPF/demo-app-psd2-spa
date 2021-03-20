import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'
import App from './app'
import LandingView from './landing-view/landing-view'
import LoginView from './login-view/login-view'
import PaymentSuccessView from './payment-success-view/payment-success-view'
import PaymentFailureView from './payment-failure-view/payment-failure-view'

const wrapApp = (url) => {
	return mount(
		<MemoryRouter initialEntries={[url]}>
			<App />
		</MemoryRouter>
	)
}

describe('App route', () => {
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

})