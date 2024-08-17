import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ProductsSelectionComponent } from './modules/products/products-selection/products-selection.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', component: ProductsSelectionComponent, canActivate: [authGuard] },
  {
    path: 'products',
    component: ProductsSelectionComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
