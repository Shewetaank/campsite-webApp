import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { ConfirmationService, Message } from 'primeng/api';
import { EditRegistrationService } from './../service/editRegistration/editRegistration.service';
import { CampsiteService } from './../service/campsite/campsite.service';
import { Subscription } from 'rxjs/Subscription';
import { BookingUpdateService } from '../service/booking/bookingupdate.service';

@Component({
    selector: 'bookings',
    templateUrl: './bookings.component.html',
    providers: [ConfirmationService],
    styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

    myBookings = [];
    _msgs: Message[] = [];
    subscription: Subscription;
    constructor(private campsiteService: CampsiteService,
        private confirmationService: ConfirmationService,
        private editRegistrationService: EditRegistrationService,
        private bookingUpdateService: BookingUpdateService) {
    }

    async ngOnInit() {
        this.subscription = this.bookingUpdateService.message.subscribe(
            (message) => {
                this.updateBooking(message);
            }
        );
        this.getBookings();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async setMyBookings(response: any) {
        const user = await this.campsiteService.getUserFromAuth();
        response.forEach((element: any) => {
            if (element.user.id == user.sub) {
                this.myBookings.push(element);
            }
        });
    }

    confirmDelete(value: any) {
        this.confirmationService.confirm({
            message: 'Please confirm if you want to cancel your reservation?',
            header: 'Please confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                this.deleteBooking(value);
                await this.delay(1000);
                this.refreshBookingsCalendar(value);
            },
            reject: () => {
                this._msgs = [{ severity: 'info', summary: 'Rejected', detail: 'Your booking is confirmed with us. Hope you have a good stay!' }];
            }
        });
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async deleteBooking(value: any) {
        this.campsiteService.deleteBooking(value.bookingNumber)
            .then(async res => {
                if (res.json() == 1) {
                    this.myBookings.forEach((item, index) => {
                        if (item === value) this.myBookings.splice(index, 1);
                    });
                    this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your reservation has been cancelled!' }];
                } else {
                    this._msgs = [{ severity: 'error', summary: 'Error', detail: 'An error occured while deleting your reservation.' }];
                }
            });
    }

    editReservation(value: any) {
        this.editRegistrationService.setEditBookingMessage(value);
    }

    refreshBookingsCalendar(value: any) {
        this.editRegistrationService.setDeleteBookingMessage(value);
    }

    async updateBooking(value: any) {
        this.myBookings = [];
        this.getBookings();
    }

    getBookings() {
        this.campsiteService.getBookings()
            .then(res => {
                this.campsiteService.getUserFromAuth().then(
                    u => {
                        this.campsiteService.getUser(u.sub).then(userValue => {
                            console.log(userValue.json().profile.email);
                            res.json().forEach((element: any) => {
                                if (element.user.email == userValue.json().profile.email || element.user.id == u.sub) {
                                    this.myBookings.push(element);
                                }
                            });
                        })
                    });
            });
    }
}