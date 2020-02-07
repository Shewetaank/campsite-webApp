import { User } from '../user/user.model';

export class CampsiteRegistration {
    user: User = new User();
    bookingNumber: string;
    fromDate: Date;
    toDate: Date;
}