import { Component } from '@angular/core';
import { CampsiteService } from './../../service/campsite/campsite.service';
import 'rxjs/Rx';
import { DatesService } from 'src/app/service/dates/dates.service';
import { UserService } from 'src/app/service/user/user.service';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs/Rx';
import { EditForAnyUserService } from '../editforanyuser.service';
import { Router } from '@angular/router';

@Component({
    selector: 'campsite-register-anonymous',
    templateUrl: './anonymouscampsite.component.html',
    styleUrls: ['./anonymouscampsite.component.css']
})
export class AnonymousCampsiteComponent {

    editForm: any = {
        email: '',
        firstName: '',
        lastName: ''
    };
    dates: Array<Date>;
    invalidDates: Array<Date>;
    _msgs: Message[] = [];
    subscription1 : Subscription;
    subscription2 : Subscription;
    bookingNumber = '';
    minDate: Date;
    maxDate: Date;

    constructor(private campsiteService: CampsiteService,
        private datesService: DatesService,
        private userService: UserService,
        private editForAnyUserService: EditForAnyUserService,
        private router: Router) {
        this.minDate = new Date();
        this.maxDate = new Date(new Date().setDate(new Date().getDate() + 30));;
    }

    async ngOnInit() {
        this.subscription1 = this.editForAnyUserService.editBookingMessage.subscribe(
            (message) => {
                this.editRegistration(message);
            }
        );

        this.subscription2 = this.editForAnyUserService.deleteBookingMessage.subscribe(
            async (message) => {
                // have to put code here
                this.router.navigateByUrl('/');
                await this.updateInvalidDates();
            }
        );
        // Make get request to get all the current bookings for the campsite.
        await this.updateInvalidDates();
    }

    ngOnDestroy() {
        if (typeof this.subscription2 === undefined) {
            this.subscription2.unsubscribe();
        }
        if (typeof this.subscription1 === undefined) {
            this.subscription1.unsubscribe();
        }
    }

    async updateInvalidDates() {
        await this.campsiteService.getBookings().then(async res => {
            this.invalidDates = await this.datesService.setInvalidDates(res.json());
        })
    }

    async registerCampsite() {
        var register = await this.userService.getRegisterCampsiteObject(this.editForm, this.dates);
        if (this.bookingNumber.length != 0) {
            register.bookingNumber = this.bookingNumber;
        }
        var totalDates = this.datesService.getDatesInARangeOnUI(register.fromDate, register.toDate);
        if (this.datesService.inValidDateSelected(totalDates, this.invalidDates)) {
            this._msgs = [];
            this._msgs = [{ severity: 'warn', summary: 'Error', detail: 'You have selected a range with invalid dates.' }];
        } else {
            if (totalDates.length <= 3) {
                // add the dates to invalidDates
                await this.campsiteService.addRegistrationForAnonymous(register).then(res => {
                    if (res.status == 200) {
                        if (this.bookingNumber == res.json().bookingNumber) {
                            this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your booking has been updated. Booking Number- ' + this.bookingNumber }];
                        } else {
                            this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your booking has been confirmed. Booking Number- ' + res.json().bookingNumber }];
                        }
                        this.campsiteService.getBookings().then(async res => {
                            this.invalidDates = await this.datesService.setInvalidDates(res.json());
                        })
                    } else {
                        // handle error
                        this._msgs = [{ severity: 'error', summary: 'Error', detail: 'Error while making a booking, Please try again.' }];
                    }
                });
            } else {
                this._msgs = [];
                this._msgs = [{ severity: 'warn', summary: 'Error', detail: 'You can book the island only for a maximum of 3 days.' }];
            }
        }
    }

    cancel() {
        // set edit from values to null
        this.editForm = {
            firstName: '',
            lastName: '',
            email: ''
        };
        this.dates = [];
    }

    async editRegistration(object: any) {
        console.log('going to edit now');
        this.bookingNumber = object.bookingNumber;
        this.editForm = {
            email: object.user.email,
            firstName: object.user.firstName,
            lastName: object.user.lastName
        }
        this.editForm.dates = [new Date(), new Date()];
        this.dates = [new Date(), new Date()];
        this.dates[0] = new Date();
        this.dates[1] = new Date();
    }
}