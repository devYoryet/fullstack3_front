// src/app/dashboard/dashboard.component.ts
import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductFormComponent } from './product-form/product-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductoService, Product } from '../services/producto.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    ProductFormComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'cantidad', 'acciones'];

  #snackBar = inject(MatSnackBar);
  #dialog = inject(MatDialog);
  #router = inject(Router);
  #authService = inject(AuthService);
  #productoService = inject(ProductoService)
  #ngZone = inject(NgZone);

  ngOnInit() {
    if (!this.#authService.isAdmin()) {
      this.#router.navigate(['/login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.#productoService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error completo en loadProducts:', error);
        if (NgZone.isInAngularZone()) {
          this.#snackBar.open(
            'Error al cargar productos',
            'Cerrar',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );
        } else {
          this.#ngZone.run(() => {
            this.#snackBar.open(
              'Error al cargar productos',
              'Cerrar',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              }
            );
          });
        }
      }
    });
  }

  openProductForm(product?: Product) {
    const dialogRef = this.#dialog.open(ProductFormComponent, {
      width: '500px',
      data: product ? { ...product } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateProduct(result);
        } else {
          this.createProduct(result);
        }
      }
    });
  }

  private updateProduct(product: Product) {
    this.#productoService.updateProduct(product.id, product).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === product.id);
        this.products[index] = updatedProduct;
        this.products = [...this.products];
        this.showNotification('Producto actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.showNotification('Error al actualizar el producto');
      }
    });
  }

  private createProduct(product: Product) {
    this.#productoService.createProduct(product).subscribe({
      next: (newProduct) => {
        this.products.push(newProduct);
        this.products = [...this.products];
        this.showNotification('Producto creado con éxito');
      },
      error: (error) => {
        console.error('Error al crear:', error);
        this.showNotification('Error al crear el producto');
      }
    });
  }

  deleteProduct(product: Product) {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmation) {
      this.#productoService.deleteProduct(product.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.showNotification('Producto eliminado con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.showNotification('Error al eliminar el producto');
        }
      });
    }
  }

  private showNotification(message: string) {
    this.#snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  logout() {
    this.#authService.logout();
    this.#snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000
    });
    this.#router.navigate(['/login']);
  }
}