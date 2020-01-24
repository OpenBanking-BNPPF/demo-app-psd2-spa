import { getJson, getText } from '../../helpers/reactive-api-client/reactive-api-client';

class PISPService {

    authenticateClient() {
        return getJson(`/api/payment/auth`, {method: 'POST'})
    }

    makePayment(body) {
        const options = {
            method: 'POST',
            body
        };
        return getText(`/api/payment/make`, options)
    }
}

export const pispService = new PISPService();