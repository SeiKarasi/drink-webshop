import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Product } from '../../shared/models/Product';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  imageFile?: any;
  imageFilePath?: string;

  productsForm = this.createForm({
    id: '',
    name: '',
    photo_url: '',
    short_description: '',
    long_description: '',
    category: new UntypedFormControl('Drink'),
    price: null,
    alcohol: null,
    marker: new UntypedFormControl('-'),
    quantity: 0
  });
  loginLoading: boolean = false;


  constructor(
    private fBuilder: UntypedFormBuilder,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService,
    private location: Location,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

  async onFileSelected(event: any) {
    if (this.productsForm.get('id')?.value) {
      this.imageFile = event.target.files[0];
    } else {
      this.toastr.error("Sikertelen kép választás! Add meg az ID mezőt mielőtt képet választanál!", "Kép");
      event.target.value = '';
    }
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
    formGroup.get('quantity')?.addValidators([Validators.required]);
    return formGroup;
  }


  async addProduct() {
    this.loginLoading = true;
    if (this.productsForm.get('id')?.value && this.productsForm.get('name')?.value
      && this.productsForm.get('price')?.value && this.productsForm.get('category')?.value && this.productsForm.get('quantity')?.value && this.imageFile) {
      const product: Product = {
        id: this.productsForm.get('id')?.value,
        name: this.productsForm.get('name')?.value,
        photo_url: 'images/' + this.productsForm.get('id')?.value + '.png',
        short_description: this.productsForm.get('short_description')?.value,
        long_description: '-',
        category: this.productsForm.get('category')?.value,
        price: this.productsForm.get('price')?.value,
        alcohol: this.productsForm.get('alcohol')?.value | 0,
        quantity: this.productsForm.get('quantity')?.value,
        marker: this.productsForm.get('marker')?.value
      };
      this.imageFilePath = 'images/' + this.productsForm.get('id')?.value + '.png';
      const task = this.storage.upload(this.imageFilePath, this.imageFile);
      try {
        await task;
      } catch (error) {
        console.log('Hiba történt a feltöltés során:', error);
      }
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
