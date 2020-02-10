import { Component } from '@angular/core';
import { CampsiteService } from './../../service/campsite/campsite.service';
import { ConfirmationService, Message } from 'primeng/api';
import 'rxjs/Rx';
import { EditForAnyUserService } from '../editforanyuser.service';
import { BookingForAnyUserService } from '../bookingForAnyUser.service';
import { Subscription } from 'rxjs/Rx';

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
    subscription: Subscription;

    constructor(private campsiteService: CampsiteService,
        private confirmationService: ConfirmationService,
        private bookingForAnyUserService: BookingForAnyUserService,
        private editForAnyUserService: EditForAnyUserService) {
    }

    async ngOnInit() {
        this.subscription = this.bookingForAnyUserService.message.subscribe(
            (message) => {
                this.updateBooking(message);
            }
        );
    }

    ngOnDestroy() {
        if (typeof this.subscription === undefined) {
            this.subscription.unsubscribe();
        }
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
                this.deleteBooking(value);
                this.myBookings = [];
                await this.delay(1000);
                this.refreshBookingsCalendar(value);
            },
            reject: () => {
                this._msgs = [{ severity: 'info', summary: 'Rejected', detail: 'Your booking is confirmed with us. Hope you have a good stay!' }];
            }
        });
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async deleteBooking(value: any) {
        this.campsiteService.deleteBookingForAnonymous(value.bookingNumber)
            .then(async res => {
                if(res.json() == 1) {
                    this._msgs = [{ severity: 'success', summary: 'Confirmed', detail: 'Your reservation has been cancelled!' }];
                } else {
                    this._msgs = [{ severity: 'error', summary: 'Error', detail: 'An error occured while deleting your reservation.' }];
                }
            });
    }

    editReservation(value: any) {
        this.editForAnyUserService.setEditBookingMessage(value);
    }

    refreshBookingsCalendar(value: any) {
        this.editForAnyUserService.setDeleteBookingMessage(value);
    }

    async updateBooking(value: any) {
        this.myBookings = [];
    }
}