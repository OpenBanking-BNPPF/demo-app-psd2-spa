import { DateTime } from 'luxon'

class Formatter {
	formatIBAN (iban) {
		return iban.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
	}

	formatAmount (amount) {
		return amount.toFixed(2)
	}

	getDay (date) {
		return DateTime.fromISO(date).day
	}

	getMonth (date) {
		return DateTime.fromISO(date).monthShort
	}
}

export const formatter = new Formatter()
