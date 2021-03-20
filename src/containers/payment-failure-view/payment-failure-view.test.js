import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import PaymentFailureView from './payment-failure-view'

describe('PaymentFailureView mounted', () => {
	it('should show error message', () => {
		const match = {}
		const history = createMemoryHistory();
		const wrapper = mount(<PaymentFailureView match={match} history={history}/>)
		expect(wrapper.find('.payment-failure-message').text()).toBe('Something went wrong! Please retry later !')
	})

	it('back button should bring you to accounts', () => {
		const match = {}
		const history = createMemoryHistory();
		const wrapper = mount(<PaymentFailureView match={match} history={history}/>)
		wrapper.find('.back-btn').simulate('click')
		expect(history.location.pathname).toBe('/accounts')
	})

})