import assert from 'assert';
import formatter from '../../../src/helpers/formatter/formatter'


describe("Formatter testing", () => {
    it("Should format IBAN correctly", () => {
        assert.strictEqual(formatter.formatIBAN('BE19001288305634'), 'BE000000000')  
    });
});