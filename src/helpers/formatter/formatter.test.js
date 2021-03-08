import { formatter } from './formatter'

describe('Formatter', () => {


	it('Should format IBAN', () => {
		const IBAN = formatter.formatIBAN('BE19001123456789')
		expect(IBAN).toBe('BE19 0011 2345 6789')
	})
})
