import { formatter } from './formatter'

describe('Formatter', () => {


	it('Should format IBAN', () => {
		const IBAN = formatter.formatIBAN('BE19001123456789')
		expect(IBAN).toBe('BE19 0011 2345 6789')
	})

	it('Should format amount for integer', () => {
		const amount = formatter.formatAmount(+'123')
		expect(amount).toBe('123.00')
	})

	it('Should format amount for float, 2 precision', () => {
		const amount = formatter.formatAmount(+'123.45')
		expect(amount).toBe('123.45')
	})

	it('Should format amount for float, 1 precision', () => {
		const amount = formatter.formatAmount(+'123.4')
		expect(amount).toBe('123.40')
	})

	it('Should format amount for float, 3 precision round up', () => {
		const amount = formatter.formatAmount(+'123.456')
		expect(amount).toBe('123.46')
	})

	it('Should format amount for float, 3 precision round down', () => {
		const amount = formatter.formatAmount(+'123.454')
		expect(amount).toBe('123.45')
	})

	it('Should get Day', () => {
		const day = formatter.getDay('2021-03-16T03:04:05')
		expect(day).toBe(16)
	})

	it('Should get Month', () => {
		const day = formatter.getMonth('2021-03-16T03:04:05')
		expect(day).toBe('Mar')
	})

	it('Should format Date', () => {
		const date = formatter.formatDate(Date.parse('2021-03-16T03:04:05'))
		expect(date).toBe('2021-03-16')
	})
})
