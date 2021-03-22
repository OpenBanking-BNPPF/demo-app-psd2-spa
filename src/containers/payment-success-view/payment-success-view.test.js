import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import PaymentSuccessView from './payment-success-view'

describe('PaymentSuccessView mounted', () => {
	it('should show success message', () => {
		const match = {}
		const wrapper = mount(<PaymentSuccessView match={match} />)
		expect(wrapper.find('.payment-success-message').text()).toBe('Your payment has been requested successfully')
	})

	it('back button should bring you to accounts', () => {
		const match = {}
		const history = createMemoryHistory();
		const wrapper = mount(<PaymentSuccessView match={match} history={history}/>)
		wrapper.find('.back-btn').simulate('click')
		expect(history.location.pathname).toBe('/accounts')
	})

})