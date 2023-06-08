import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// loadChildren lazy-loading-ot valósít meg
const routes: Routes = [
  {path: 'blog',
  loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule)},
  {path: 'aboutus',
  loadChildren: () => import('./pages/aboutus/aboutus.module').then(m => m.AboutusModule)},
  {path: 'main',
  loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'registration', loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule) },
  { path: '**',
    redirectTo: '/main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
