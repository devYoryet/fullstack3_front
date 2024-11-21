import { Component, OnInit } from '@angular/core';
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
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;  // Añadimos la propiedad imagen

}

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
    MatToolbarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      nombre: "Laptop HP",
      descripcion: "Laptop HP Pavilion 15.6\" con Intel i5",
      precio: 899.99,
      stock: 10,
      imagen: "assets/images/products/laptop-hp.jpg"

    },
    {
      id: 2,
      nombre: "iPhone 13",
      descripcion: "Apple iPhone 13 128GB",
      precio: 999.99,
      stock: 15,
      imagen: "assets/images/products/iphone-13.jpg"

    },
    {
      id: 3,
      nombre: "Samsung TV",
      descripcion: "Samsung 55\" 4K Smart TV",
      precio: 699.99,
      stock: 8,
      imagen: "assets/images/products/samsung-tv.jpg"

    }
  ];

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'acciones'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  openProductForm(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product ? {...product} : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Actualizar producto existente
          const index = this.products.findIndex(p => p.id === result.id);
          this.products[index] = result;
          this.showNotification('Producto actualizado con éxito');
        } else {
          // Crear nuevo producto
          result.id = this.getNextId();
          this.products.push(result);
          this.showNotification('Producto creado con éxito');
        }
        this.products = [...this.products];
      }
    });
  }

  deleteProduct(product: Product) {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmation) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.showNotification('Producto eliminado con éxito');
    }
  }

  private getNextId(): number {
    return Math.max(...this.products.map(p => p.id), 0) + 1;
  }

  private showNotification(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
  
  logout() {
    this.authService.logout();
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000
    });
    this.router.navigate(['/login']);
  }

}

