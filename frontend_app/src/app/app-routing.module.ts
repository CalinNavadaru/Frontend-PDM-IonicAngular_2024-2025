import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule),
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: 'add',
    loadChildren: () => import('./add-employee/add-employee.module').then(m => m.AddEmployeePageModule),
    canActivate: [AuthGuard],
    pathMatch: "full"
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule),
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    pathMatch: 'full'
  },
  {
    path: 'add-employee',
    loadChildren: () => import('./add-employee/add-employee.module').then( m => m.AddEmployeePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
