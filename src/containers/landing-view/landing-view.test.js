import React from 'react'
import { mount } from 'enzyme'
import { createMemoryHistory } from "history";
import LandingView from './landing-view'
import { authService } from '../../services/auth/auth-service'

describe('LandingView mounted', () => {

	const mockSubscribe = jest.fn((successFn) => {
		successFn()
	})

	beforeEach(() => {
		jest.spyOn(authService, 'getToken').mockImplementation(() => ({
			subscribe: mockSubscribe
		}))
	})

	afterEach(() => {
		authService.getToken.mockClear()
	})

	it('should be loaded after succesfull fetch login url', () => {
		const match = {}
		const location = {
			search: '?bla=some1&code=myCode'
		}
		const history = createMemoryHistory();
		mount(<LandingView match={match} location={location} history={history} />)
		expect(mockSubscribe).toHaveBeenCalledTimes(1)
		expect(history.location.pathname).toBe('/accounts')
	})


})