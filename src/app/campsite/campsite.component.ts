import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { EditRegistrationService } from './../service/editRegistration/editRegistration.service';
import { BookingUpdateService } from '../service/booking/bookingupdate.service';
import { Subscription } from 'rxjs/Subscription';
import { CampsiteService } from './../service/campsite/campsite.service';
import { Message } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DatesService } from '../service/dates/dates.service';
import { UserService } from '../service/user/user.service';

@Component({
    selector: 'campsite-register',
    templateUrl: './campsite.component.html',
    styleUrls: ['./campsite.component.css'],
    providers: [ConfirmationService],
})
export class CampsiteComponent implements OnInit {

    invalidDates: Array<Date>;
    dates: Array<Date>;
    subscription: Subscription;
    editForm: any = {
        email: '',
        firstName: '',
        lastName: ''
    };
    activeUser: any;
    _msgs: Message[] = [];
    minDate: Date;
    maxDate: Date;

    constructor(private campsiteService: CampsiteService,
        private editRegistrationService: EditRegistrationService,
        private bookingUpdateService: BookingUpdateService,
        private datesService: DatesService,
        private userService: UserService) {
        this.minDate = new Date();
        this.maxDate = new Date(new Date().setDate(new Date().getDate() + 30));;
    }

    async ngOnInit() {
        this.subscription = this.editRegistrationService.editBookingMessage.subscribe(
            (message) => {
                this.editRegistration(message);
            }
        );
        this.subscription = this.editRegistrationService.deleteBookingMessage.subscribe(
            async (message) => {
                // have to put code here
                console.log('updating the invalid dates');
                await this.updateInvalidDates();
            }
        );
        // Make get request to get all the current bookings for the campsite.
        await this.updateInvalidDates();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async registerCampsite() {
        var register = await this.userService.getRegisterCampsiteObject(this.editForm, this.dates);
        var totalDates = this.datesService.getDatesInARangeOnUI(register.fromDate, register.toDate);
        if (this.datesService.inValidDateSelected(totalDates, this.invalidDates)) {
            this._msgs = [];
            this._msgs = [{ severity: 'warn', summary: 'Error', detail: 'You have selected a range with invalid dates.' }];
        } else {
            if (totalDates.length <= 3) {
                // add the dates to invalidDates
                this.campsiteService.addRegistration(register).then(async res => {
                    if (res.status == 200) {
                        var bookingNumber = res.json().bookingNumber;
                        this.refreshBookings(res.json());
                        this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your booking has been confirmed. Booking Number- ' + bookingNumber }];
                        await this.updateInvalidDates();
                    } else {
                        // handle error

                    }
                });
            } else {
                this._msgs = [];
                this._msgs = [{ severity: 'warn', summary: 'Error', detail: 'You can book the island only for a maximum of 3 days.' }];
            }
        }
    }

    async updateInvalidDates() {
        await this.campsiteService.getBookings().then(async res => {
            this.invalidDates = await this.datesService.setInvalidDates(res.json());
        })
    }
    
    refreshBookings(value: any) {
        this.bookingUpdateService.setMessage(value);
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
        const user = await this.campsiteService.getUserFromAuth();
        await this.campsiteService.getUser(user.sub).then(res => {
            this.activeUser = res.json();
        });
        this.editForm = {
            email: object.user.email,
            firstName: this.activeUser.profile.firstName,
            lastName: this.activeUser.profile.lastName
        }
        this.editForm.dates = [new Date(), new Date()];
        this.dates[0] = object.fromDate;
        this.dates[1] = object.toDate;
    }
}