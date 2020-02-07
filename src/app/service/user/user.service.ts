import { Injectable } from '@angular/core';
import { CampsiteRegistration } from 'src/app/campsite/campsite-register.model';
import { CampsiteService } from '../campsite/campsite.service';

@Injectable()
export class UserService {

    constructor(private campsiteService: CampsiteService) {
    }

    async getRegisterCampsiteObject(editForm: any, dates: Array<Date>) {
        const user = await this.campsiteService.getUserFromAuth();
        var register = new CampsiteRegistration();
        register.user.firstName = editForm.firstName;
        register.user.lastName = editForm.lastName;
        register.user.email = editForm.email;
        if (typeof user != 'undefined') {
            register.user.id = user.sub;
        }
        register.fromDate = dates[0];
        if (dates[1] == null) {
            register.toDate = dates[0];
        } else {
            register.toDate = dates[1];
        }
        return register;
    }
}