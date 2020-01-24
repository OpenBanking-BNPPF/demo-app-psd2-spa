import { forkJoin } from 'rxjs';

class ApiService {
    concatRequests(...requests) {
        return forkJoin(requests)
    }
}

export const apiService = new ApiService();