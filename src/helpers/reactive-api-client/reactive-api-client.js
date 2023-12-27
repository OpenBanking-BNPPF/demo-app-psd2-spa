import { ajax } from 'rxjs/ajax';
import { first, map } from 'rxjs/operators';

export class ReactiveApiClient {

    static makeRequest(url, customOptions = {}) {
        let defaultOptions = {
            headers: {'Cache-Control': 'no-cache'},
            createXHR: () => new XMLHttpRequest(),
        };
        const options = {url, ...defaultOptions, ...customOptions};
        const accessToken = sessionStorage.getItem('accessToken');
        //const searchPattern = new RegExp('^/api/', 'i');
        if (accessToken) {
            options.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return ajax(options).pipe(first()).pipe(
            map(data => data.response)
        )
    }

    static getJson(url, customOptions) {
        return ReactiveApiClient.makeRequest(url, {...{responseType: 'json'}, ...customOptions});
    }

    static getText(url, customOptions) {
        return ReactiveApiClient.makeRequest(url, {...{responseType: 'text'}, ...customOptions});
    }

    static getBlob(url, customOptions) {
        return ReactiveApiClient.makeRequest(url, {...{responseType: 'blob'}, ...customOptions});
    }
}

const getJson = ReactiveApiClient.getJson;
const getText = ReactiveApiClient.getText;
const getBlob = ReactiveApiClient.getBlob;
const makeRequest = ReactiveApiClient.makeRequest;

export { getJson, getText, getBlob, makeRequest }