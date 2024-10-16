import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'list',
        component: EmployeeListComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
