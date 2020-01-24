import { getText } from '../../helpers/reactive-api-client/reactive-api-client';
import { tap, map } from 'rxjs/operators';

class AuthService {

    login() {
        return getText(`/api/auth/login`)
    }

    getToken(authorizationCode) {
        const options = {
            method: 'POST',
            body: {code: authorizationCode}
        };
        return getText(`/api/auth/token`, options)
            .pipe(
                map(resp => JSON.parse(resp)),
                tap((resp) => {
                    this.initSession(resp);
                })
            )
    }

    initSession(resp) {
        const expiresDate = new Date();
        //expiresDate.setSeconds( expiresDate.getSeconds() + 65 );
        expiresDate.setSeconds(expiresDate.getSeconds() + resp.expires);
        sessionStorage.setItem('expiresIn', expiresDate.getTime());
        sessionStorage.setItem('accessToken', resp.access_token);
        sessionStorage.setItem('refreshToken', resp.refresh);
        sessionStorage.setItem('securityData', JSON.stringify(resp));
    }
}

export const authService = new AuthService();