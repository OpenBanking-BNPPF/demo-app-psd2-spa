import { first } from 'rxjs/operators';
import { getJson, getText } from '../../helpers/reactive-api-client/reactive-api-client';
import { authService } from "../auth/auth-service";

class PISPService {

    authenticateClient() {
        return getJson(`/api/payment/auth`, {method: 'POST'}).pipe(first())
    }

    makePayment(body) {
        const options = {
            method: 'POST',
            body
        };
        return getText(`/api/payment/make?brand=${authService.getBrand()}`, options).pipe(first())
    }
}

export const pispService = new PISPService();