import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CampsiteComponent } from './campsite/campsite.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ManageComponent } from './manage/manage.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { EditRegistrationService } from './service/editRegistration/editRegistration.service';
import { BookingUpdateService } from './service/booking/bookingupdate.service'
import { CampsiteService } from './service/campsite/campsite.service';
import { AnyuserComponent } from './anyuser/anyuser.component';
import { AnonymousBookingComponent } from './anyuser/anonymous_booking/anonymousbooking.component';
import { AnonymousCampsiteComponent } from './anyuser/anonymouscampsite/anonymouscampsite.component';
import { DatesService } from './service/dates/dates.service';
import { UserService } from './service/user/user.service';
import { OktaAuthModule } from '@okta/okta-angular';
import { EditForAnyUserService } from './anyuser/editforanyuser.service';
import { BookingForAnyUserService } from './anyuser/bookingForAnyUser.service';

const config = {
  issuer: 'https://dev-356601.okta.com/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oa16usd50tuZf2uM4x6',
  pkce: true
}

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    CampsiteComponent,
    BookingsComponent,
    ManageComponent,
    AnyuserComponent,
    AnonymousBookingComponent,
    AnonymousCampsiteComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    CalendarModule,
    OktaAuthModule.initAuth(config),
    BrowserAnimationsModule,
    FormsModule,
    TableModule,
    ConfirmDialogModule,
    MessagesModule
  ],
  providers: [EditRegistrationService, CampsiteService, BookingUpdateService,
    DatesService, UserService, EditForAnyUserService, BookingForAnyUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
