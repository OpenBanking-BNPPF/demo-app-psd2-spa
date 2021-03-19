import React from 'react'
import { mount } from 'enzyme'
import { of } from 'rxjs'
import { createMemoryHistory } from "history"
import LandingView from './landing-view'
import { authService } from '../../services/auth/auth-service'

describe('LandingView mounted', () => {
	beforeEach(() => {
		jest.spyOn(console, 'error').mockImplementation(jest.fn())
		jest.spyOn(authService, 'getToken').mockImplementation(() => of('my-access-token'))
	})

	afterEach(() => jest.restoreAllMocks())

	it('should be redirected to accounts after successfull landing', () => {
		const match = {}
		const location = {
			search: '?bla=some1&code=myCode'
		}
		const history = createMemoryHistory();
		mount(<LandingView match={match} location={location} history={history} />)
		expect(history.location.pathname).toBe('/accounts')
	})

})