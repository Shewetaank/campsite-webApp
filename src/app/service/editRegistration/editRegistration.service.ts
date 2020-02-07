import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EditRegistrationService {

    public editBookingMessage = new Subject<any>();
    public deleteBookingMessage = new Subject<any>();

    setEditBookingMessage(value: any) {
        this.editBookingMessage.next(value);
    }

    setDeleteBookingMessage(value: any) {
        this.deleteBookingMessage.next(value);
    }
}