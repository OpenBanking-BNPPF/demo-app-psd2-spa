import React from 'react'
import { shallow, mount } from 'enzyme'
import { of, throwError } from 'rxjs'
import LoginView from './login-view'
import Spinner from '../../components/spinner/spinner'
import { authService } from '../../services/auth/auth-service'


describe('LoginView shallow', () => {
	beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()))
	afterEach(() => jest.restoreAllMocks())

	it('should be loading', () => {
		const wrapper = shallow(<LoginView />)
		expect(wrapper.contains(<Spinner text='loading data' />)).toEqual(true)
	})
})

describe('LoginView mounted', () => {
	beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()))
	afterEach(() => jest.restoreAllMocks())

	describe('Mount fails', () => {
		beforeEach(() => jest.spyOn(authService, 'login').mockImplementation(() => throwError('Failed login')))

		it('should be loading after error during fetch login url', () => {
			const wrapper = mount(<LoginView />)
			expect(wrapper.find(Spinner)).toHaveLength(1)
			expect(wrapper.find('button')).toHaveLength(0)
		})
	})

	describe('Mount success', () => {
		const { location } = window;
		const mockSelectBrand = jest.fn(() => { })

		beforeEach(() => {
			jest.spyOn(authService, 'login').mockImplementation(() => of('http://dummyLoginUrl'))
			jest.spyOn(authService, 'selectBrand').mockImplementation(mockSelectBrand)

			delete window.location
			window.location = {
				href: '',
			}
		})

		afterEach(() => {
			window.location = location
		})

		it('should be loaded after succesfull fetch login url', () => {
			const wrapper = mount(<LoginView />);
			expect(wrapper.find('button')).toHaveLength(3)
			expect(wrapper.find(Spinner)).toHaveLength(0)
			expect(mockSelectBrand).toHaveBeenCalledTimes(0)
		})

		it('should be redirected when Clicking on first button', () => {
			const wrapper = mount(<LoginView />)
			expect(wrapper.find('button')).toHaveLength(3)
			wrapper.find('button').at(0).simulate('click')
			expect(window.location).toBe('http://dummyLoginUrl&brand=bnppf')
			expect(mockSelectBrand).toHaveBeenCalledTimes(1)
		})

		it('should unsubscribe when unmounting', () => {
			const wrapper = mount(<LoginView />)
			wrapper.unmount()
		})
	})

})