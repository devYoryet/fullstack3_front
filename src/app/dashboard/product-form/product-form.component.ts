import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  template: `
    <h2 mat-dialog-title>{{data ? 'Editar' : 'Nuevo'}} Producto</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" placeholder="Nombre del producto">
          @if (productForm.get('nombre')?.hasError('required') && productForm.get('nombre')?.touched) {
            <mat-error>El nombre es requerido</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"></textarea>
          @if (productForm.get('descripcion')?.hasError('required') && productForm.get('descripcion')?.touched) {
            <mat-error>La descripción es requerida</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" min="0">
          @if (productForm.get('precio')?.hasError('required') && productForm.get('precio')?.touched) {
            <mat-error>El precio es requerido</mat-error>
          }
          @if (productForm.get('precio')?.hasError('min')) {
            <mat-error>El precio debe ser mayor a 0</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" min="0">
          @if (productForm.get('stock')?.hasError('required') && productForm.get('stock')?.touched) {
            <mat-error>El stock es requerido</mat-error>
          }
          @if (productForm.get('stock')?.hasError('min')) {
            <mat-error>El stock debe ser mayor o igual a 0</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="productForm.invalid"
              (click)="onSubmit()">
        {{data ? 'Actualizar' : 'Crear'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required],
      descripcion: [data?.descripcion || '', Validators.required],
      precio: [data?.precio || '', [Validators.required, Validators.min(0)]],
      stock: [data?.stock || '', [Validators.required, Validators.min(0)]]
    });

    if (data) {
      this.productForm.addControl('id', this.fb.control(data.id));
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}