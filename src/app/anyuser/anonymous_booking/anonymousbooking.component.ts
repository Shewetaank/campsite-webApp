import { Component } from '@angular/core';
import { CampsiteService } from './../../service/campsite/campsite.service';
import { ConfirmationService, Message } from 'primeng/api';
import 'rxjs/Rx';
import { EditForAnyUserService } from '../editforanyuser.service';

@Component({
    templateUrl: './anonymousbooking.component.html',
    selector: 'anonymousbooking',
    providers: [ConfirmationService],
    styleUrls: ['./anonymousbooking.component.css']
})
export class AnonymousBookingComponent {

    myBookings = [];
    bookingNumber = '';
    _msgs: Message[] = [];
    hide: boolean = false;

    constructor(private campsiteService: CampsiteService,
        private confirmationService: ConfirmationService,
        private editForAnyUserService: EditForAnyUserService) {
    }

    getBookings(bookingNumber: string) {
        this.myBookings = [];
        this.campsiteService.getBookingByBookingNumber(bookingNumber)
            .then(async res => {
                await res.json().forEach((element: any) => {
                    if (element != null) {
                        this.myBookings.push(element);
                    }
                });
            }).then(() => {
                if (this.myBookings.length == 0) {
                    this.hide = false;
                    this._msgs = [{ severity: 'warn', summary: 'No booking found', detail: 'No current booking has been found with the booking number: ' + this.bookingNumber }];
                } else {
                    this.hide = true;
                }
            });
    }

    async getBooking() {
        await this.getBookings(this.bookingNumber);
    }

    confirmDelete(value: any) {
        this.confirmationService.confirm({
            message: 'Please confirm if you want to cancel your reservation?',
            header: 'Please confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your reservation has been cancelled!' }];
                this.deleteBooking(value);
                this.myBookings = [];
                this.refreshBookingsCalendar(value);
            },
            reject: () => {
                this._msgs = [{ severity: 'info', summary: 'Rejected', detail: 'Your booking is confirmed with us. Hope you have a good stay!' }];
            }
        });
    }

    async deleteBooking(value: any) {
        this.campsiteService.deleteBookingForAnonymous(value.bookingNumber)
            .then(async res => {
                console.log(res.text);
            });
    }

    editReservation(value: any) {
        this.editForAnyUserService.setEditBookingMessage(value);
    }

    refreshBookingsCalendar(value: any) {
        this.editForAnyUserService.setDeleteBookingMessage(value);
    }
}