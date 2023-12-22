import { getJson } from '../../helpers/reactive-api-client/reactive-api-client';
import { first, map } from 'rxjs/operators';
import { apiService } from "../apis/apis";
import { authService } from "../auth/auth-service";

class AISPService {

    /**
     * @function
     * @description This call returns all payment accounts that are relevant the PSU on behalf of whom the AISP is connected.
     * @return {Observable} accounts
     */
    getAccounts() {
        return getJson(`/api/accounts?brand=${authService.getBrand()}`).pipe(first())
    }

    /**
     * @function
     * @description This call returns the balances and the transaction of a given account
     * @return {Observable} account
     */
    getAccountDetails(account) {
        return apiService.concatRequests(
            this.getBalances(account.resourceId),
            this.getTransactions(account.resourceId)).pipe(first())
            .pipe(
                map(data => {
                    account.balances = data[0];
                    account.transactions = data[1];
                    return account
                })
            )
    }

    getBalances(accountId) {
        return getJson(`/api/accounts/balances?accountResourceId=${accountId}&brand=${authService.getBrand()}`).pipe(first())
    }

    getTransactions(accountId) {
        return getJson(`/api/accounts/transactions?accountResourceId=${accountId}&brand=${authService.getBrand()}`).pipe(first())
    }

}

export const aispService = new AISPService();