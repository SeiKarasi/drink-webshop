import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { NotAuthGuard } from './shared/services/not-auth.guard';
import { PaymentGuard } from './shared/services/payment.guard';

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
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule) 
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
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule) 
  },
  { 
    path: 'shopping_bag',
    loadChildren: () => import('./pages/shopping-bag/shopping-bag.module').then(m => m.ShoppingBagModule)
  },
  {
    path: 'success-payment',
    loadChildren: () => import('./pages/payment/success-payment/success-payment.module').then(m => m.SuccessPaymentModule),
    canActivate: [PaymentGuard]
  },
  { 
    path: 'cancel-payment',
    loadChildren: () => import('./pages/payment/cancel-payment/cancel-payment.module').then(m => m.CancelPaymentModule),
    canActivate: [PaymentGuard] 
  },
  { 
    path: 'newProduct',
    loadChildren: () => import('./pages/new-product/new-product.module').then(m => m.NewProductModule) 
  },
  { 
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },  
  {
    path: '**',
    redirectTo: '/main'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
