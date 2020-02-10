import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { OktaAuthService } from '@okta/okta-angular';
import { CampsiteRegistration } from './../../campsite/campsite-register.model';
import { User } from 'src/app/user/user.model';

@Injectable()
export class CampsiteService {

    baseUrl: string = 'http://localhost:8081';
    user: any;

    constructor(private oktaAuth: OktaAuthService, private http: Http) {
    }

    async getUserFromAuth() {
        return await this.oktaAuth.getUser();
    }

    async getAccessToken() {
        return await this.oktaAuth.getAccessToken();
    }

    async getBookings() {
        return this.http.get(
            this.baseUrl + '/campsiteRegistration/get'
        ).toPromise();
    }

    async getBookingByBookingNumber(bookingNumber: string) {
        return this.http.get(
            this.baseUrl + '/campsiteRegistration/anonymous/' + bookingNumber
        ).toPromise();
    }

    async deleteBookingForAnonymous(bookingNumber: string) {
        return this.http.delete(
            this.baseUrl + '/campsiteRegistration/anonymous/' + bookingNumber
        ).toPromise();
    }

    async deleteBooking(bookingNumber: string) {
        return this.http.delete(
            this.baseUrl + '/campsiteRegistration/' + bookingNumber,
            new RequestOptions({ headers: await this.getHeader() })
        ).toPromise();
    }

    async getHeader() {
        return await new Headers({
            Authorization: 'Bearer ' + await this.getAccessToken()
        });
    }

    async addRegistration(register: CampsiteRegistration) {
        // Make request
        return this.http.post(
            this.baseUrl + '/campsiteRegistration',
            register,
            new RequestOptions({ headers: await this.getHeader() })
        ).toPromise();
    }

    async addRegistrationForAnonymous(register: CampsiteRegistration) {
        // Make request
        return this.http.post(
            this.baseUrl + '/campsiteRegistration/anonymous',
            register
        ).toPromise();
    }

    async getUser(id: string) {
        return this.http.get(
            this.baseUrl + '/registerUser/' + id,
            new RequestOptions({ headers: await this.getHeader() })
        ).toPromise();
    }

    async registerUser(user: User) {
        return this.http.post(
            this.baseUrl + '/registerUser/create',
            user
        ).toPromise();
    }
}