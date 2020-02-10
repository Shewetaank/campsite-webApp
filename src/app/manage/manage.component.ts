import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { OktaAuthService } from '@okta/okta-angular';
import 'rxjs/Rx';
import { Subscription } from 'rxjs/Rx';

@Component({
    styleUrls: ['./manage.component.css'],
    templateUrl: './manage.component.html'
})
export class ManageComponent {

    subscription: Subscription;
    
    constructor(private oktaAuth: OktaAuthService, private http: Http) {
    }   
}