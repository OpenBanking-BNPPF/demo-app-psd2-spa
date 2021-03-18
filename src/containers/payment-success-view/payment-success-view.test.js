import React from 'react'
import { mount } from 'enzyme'
import PaymentSuccessView from './payment-success-view'

describe('PaymentSuccessView mounted', () => {
	it('should show error message', () => {
		const match = {}
		const wrapper = mount(<PaymentSuccessView match={match} />)
		expect(wrapper.find('.payment-success-message').text()).toBe('Your payment has been requested successfully')
	})

})