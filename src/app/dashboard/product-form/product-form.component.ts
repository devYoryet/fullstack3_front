// src/app/dashboard/product-form/product-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../services/producto.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required]],
      descripcion: [data?.descripcion || '', [Validators.required]],
      precio: [data?.precio || '', [Validators.required, Validators.min(0)]],
      stock: [data?.stock || '', [Validators.required, Validators.min(0)]],
      imagen: [data?.imagen || ''],
      cantidad: [data?.cantidad || 0]
    });
  
    if (data) {
      this.productForm.addControl('id', this.fb.control(data.id));
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      // Asegurarse de que precio y stock sean números
      formValue.precio = Number(formValue.precio);
      formValue.stock = Number(formValue.stock);
      formValue.cantidad = Number(formValue.cantidad);

      this.dialogRef.close(formValue);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  /**
   * Validadores personalizados si los necesitas
   */
  private validatePrice(control: any) {
    const price = control.value;
    if (price <= 0) {
      return { invalidPrice: true };
    }
    return null;
  }

  private validateStock(control: any) {
    const stock = control.value;
    if (stock < 0) {
      return { invalidStock: true };
    }
    return null;
  }
}