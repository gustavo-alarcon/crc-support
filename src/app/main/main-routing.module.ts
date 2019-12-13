import { ListRequestComponent } from './list-request/list-request.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { RequestComponent } from './request/request.component';
import { WebComponent } from './web/web.component';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: WebComponent,

      },
      {
        path: 'requests',
        component: ListRequestComponent
      },
      {
        path: 'new_request',
        component: NewRequestComponent
      },
      {
        path: 'request',
        component: RequestComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
