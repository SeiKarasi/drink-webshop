import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../shared/models/Product';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  products: Array<Product> = [];
  productsForm = this.createForm({
    id: '',
    name: '',
    photo_url: '',
    short_description: '',
    long_description: '',
    category: '',
    price: null,
    alcohol: null,
    marker: ''
  });
  loginLoading: boolean = false;

  constructor(
    private fBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService,
    private location: Location) { }

  ngOnInit(): void {
  }

  goBack(){
    this.location.back();
  }

  // Arra kell, hogy garantálni tudjuk a User típust
  // simán az fBuilder.grouppal ez nem tehető meg!
  createForm(model: any) {
    let formGroup = this.fBuilder.group(model);
    // Validátorokat rendelünk az egyes elemekhez!
    formGroup.get('id')?.addValidators([Validators.required]);
    formGroup.get('name')?.addValidators([Validators.required]);
    formGroup.get('price')?.addValidators([Validators.required]);
    formGroup.get('category')?.addValidators([Validators.required]);
    return formGroup;
  }


  // ITT KELL FOLYTATNI
  async addProduct() {
    this.loginLoading = true;
    if (this.productsForm.get('id')?.value && this.productsForm.get('name')?.value
    && this.productsForm.get('price')?.value && this.productsForm.get('category')?.value) {
      const product: Product = {
        id: this.productsForm.get('id')?.value,
        name: this.productsForm.get('name')?.value,
        photo_url: 'images/' + this.productsForm.get('id')?.value + ".jpg",
        short_description: this.productsForm.get('short_description')?.value,
        long_description: '-',
        category: this.productsForm.get('category')?.value,
        price: this.productsForm.get('price')?.value,
        alcohol: this.productsForm.get('alcohol')?.value | 0,
        marker: this.productsForm.get('marker')?.value
      };

      await this.productService.create(product).then(_ => {
        console.log('Termék hozzáadása sikeres');
        this.router.navigateByUrl('/main');
        this.toastr.success("Sikeres termék felvitel!", "Termék");
        this.loginLoading = false;
      }).catch(error => {
        this.toastr.error("Sikertelen termék felvitel!", "Termék");
        console.error(error);
        this.loginLoading = false;
      });
    } else {
      this.toastr.error("Sikertelen termék felvitel!", "Termék");
      this.loginLoading = false;
    }
  }
}
