import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { NotAuthGuard } from './shared/services/not-auth.guard';

// loadChildren lazy-loading-ot valósít meg
const routes: Routes = [
  {
    path: 'aboutus',
    loadChildren: () => import('./pages/aboutus/aboutus.module').then(m => m.AboutusModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)
  },
  { 
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [NotAuthGuard]
  },
  { 
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationModule),
    canActivate: [NotAuthGuard]
  },
  {
    path: '**',
    redirectTo: '/main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
