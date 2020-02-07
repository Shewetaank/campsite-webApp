import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BookingUpdateService {

    public message = new Subject<any>();

    setMessage(value: any) {
        this.message.next(value);
    }
}