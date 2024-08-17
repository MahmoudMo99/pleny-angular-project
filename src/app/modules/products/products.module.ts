import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { ProductsSelectionComponent } from './products-selection/products-selection.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductsComponent, ProductsSelectionComponent],
  imports: [CommonModule, HttpClientModule, FormsModule],
  exports: [ProductsComponent, ProductsSelectionComponent],
})
export class ProductsModule {}
