import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';

import { UserComponent } from './user/user.component';
import { ManageComponent } from './manage/manage.component';
import { AnyuserComponent } from './anyuser/anyuser.component';

export function onAuthRequired({ oktaAuth, router }) {
  // Redirect the user to your custom login page
  router.navigate(['/']);
}

const routes: Routes = [
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  },
  {
    path: "",
    component: AnyuserComponent,
    outlet: "sidebar"
 },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [ OktaAuthGuard ],
    data: {
      onAuthRequired
    }
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
