import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { User } from './user.model'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CampsiteService } from '../service/campsite/campsite.service';

@Component({
    styleUrls: ['./user.component.css'],
    templateUrl: './user.component.html'
})
export class UserComponent {
    form: FormGroup;
    constructor(private http: Http, fb: FormBuilder, public router: Router,
        private campsiteService: CampsiteService) {
        this.form = fb.group({
            "firstName": ["", Validators.required],
            "lastName": ["", Validators.required],
            "email": ["", Validators.required],
            "password": ["", Validators.required]
        });
    }

    async registerUser() {
        console.log('in the register user');
        var user = new User();
        user.firstName = this.form.value.firstName;
        user.lastName = this.form.value.lastName;
        user.email = this.form.value.email;
        user.password = this.form.value.password;
        // Make the request to create user
        this.campsiteService.registerUser(user).then(res => {
           console.log(res);  
        });
        this.router.navigateByUrl('manage');
    }
}