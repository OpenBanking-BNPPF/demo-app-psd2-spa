import React from 'react'
import { shallow, mount } from 'enzyme'
import LoginView from './login-view'
import Spinner from '../../components/spinner/spinner'
import { authService } from '../../services/auth/auth-service'


// describe('LoginView shallow', () => {
// 	it('should be loading', () => {
// 		const wrapper = shallow(<LoginView />)
// 		expect(wrapper.contains(<Spinner text='loading data' />)).toEqual(true)
// 	})
// })

describe('LoginView mounted', () => {

	describe('Mount fails', () => {
		const mockSubscribeFail = jest.fn((successFn, errFn) => errFn('Failed login'))

		beforeEach(() => jest.spyOn(authService, 'login').mockImplementation(() => ({
			subscribe: mockSubscribeFail
		})))

		afterEach(() => authService.login.mockClear())

		it('should be loading after error during fetch login url', () => {
			const wrapper = mount(<LoginView />)
			expect(wrapper.find(Spinner)).toHaveLength(1)
			expect(wrapper.find('button')).toHaveLength(0)
			expect(mockSubscribeFail).toHaveBeenCalledTimes(1)
		})
	})

	describe('Mount success', () => {
		const { location } = window;
		const mockUnsubscribe = jest.fn(() => { })
		const mockSubscribe = jest.fn((successFn, errFn) => {
			successFn('http://dummyLoginUrl')
			return {
				unsubscribe: mockUnsubscribe
			}
		})
		const mockSelectBrand = jest.fn(() => { })

		beforeEach(() => {
			jest.spyOn(authService, 'login').mockImplementation(() => ({
				subscribe: mockSubscribe
			}))
			jest.spyOn(authService, 'selectBrand').mockImplementation(mockSelectBrand)

			delete window.location
			window.location = {
				href: '',
			}
		})

		afterEach(() => {
			window.location = location;
			authService.login.mockClear()
			authService.selectBrand.mockClear()
		})

		it('should be loaded after succesfull fetch login url', () => {
			const wrapper = mount(<LoginView />);
			expect(wrapper.find('button')).toHaveLength(3)
			expect(wrapper.find(Spinner)).toHaveLength(0)
			expect(mockSubscribe).toHaveBeenCalledTimes(1)
			expect(mockSelectBrand).toHaveBeenCalledTimes(0)
		})

		it('should be redirected when Clicking on first button', () => {
			const wrapper = mount(<LoginView />)
			expect(wrapper.find('button')).toHaveLength(3)
			wrapper.find('button').at(0).simulate('click')
			expect(window.location).toBe('http://dummyLoginUrl&brand=bnppf')
			expect(mockSubscribe).toHaveBeenCalledTimes(1)
			expect(mockSelectBrand).toHaveBeenCalledTimes(1)
		})

		it('should unsubscribe when unmounting', () => {
			const wrapper = mount(<LoginView />)
			wrapper.unmount()
			expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
		})


	})


})