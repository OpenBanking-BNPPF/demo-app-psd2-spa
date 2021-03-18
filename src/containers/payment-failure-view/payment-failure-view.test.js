import React from 'react'
import { mount } from 'enzyme'
import PaymentFailureView from './payment-failure-view'

describe('PaymentFailureView mounted', () => {
	it('should show error message', () => {
		const match = {}
		const wrapper = mount(<PaymentFailureView match={match} />)
		expect(wrapper.find('.payment-failure-message').text()).toBe('Something went wrong! Please retry later !')
	})

})