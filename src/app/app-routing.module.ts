import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./main/main.module').then(mod => mod.MainModule),
  },
  /*
  {
    path: 'notifications',
    loadChildren: () => import('./main/notifications/notifications.module').then(mod => mod.NotificationsModule),
    canActivate: [AuthGuard]
  },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
