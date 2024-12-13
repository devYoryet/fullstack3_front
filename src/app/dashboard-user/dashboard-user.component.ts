import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductoService, Product } from '../services/producto.service';
import { inject } from '@angular/core';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  viewProviders: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } }
  ],
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  products: Product[] = [];
  cart: CartItem[] = [];
  showCart = false;

  #snackBar = inject(MatSnackBar);
  #router = inject(Router);
  #authService = inject(AuthService);
  #productoService = inject(ProductoService);
  constructor(
    // ... otros servicios
    public productoService: ProductoService  // Necesita ser público para usarlo en el template
  ) {}
  ngOnInit(): void {
    if (!this.#authService.isUser()) {
      this.#router.navigate(['/login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.#productoService.getProducts({ limit: 4 }).subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar productos:', error);
        this.#snackBar.open('Error al cargar productos', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  addToCart(product: Product): void {
    const cartItem = this.cart.find(item => item.product.id === product.id);
    if (cartItem) {
      cartItem.quantity++;
      this.#snackBar.open('Cantidad actualizada en el carrito', 'Cerrar', {
        duration: 2000
      });
    } else {
      this.cart.push({ product, quantity: 1 });
      this.#snackBar.open('Producto agregado al carrito', 'Cerrar', {
        duration: 2000
      });
    }
  }

  removeFromCart(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart = this.cart.filter(i => i.product.id !== item.product.id);
    }
    this.#snackBar.open('Producto removido del carrito', 'Cerrar', {
      duration: 2000
    });
  }

  checkout(): void {
    if (this.cart.length === 0) {
      this.#snackBar.open('El carrito está vacío', 'Cerrar', {
        duration: 2000
      });
      return;
    }
    this.#snackBar.open('¡Compra realizada con éxito!', 'Cerrar', {
      duration: 2000
    });
    this.cart = [];
  }

  logout(): void {
    this.#authService.logout();
    this.#snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000
    });
    this.#router.navigate(['/login']);
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.product.precio * item.quantity, 0);
  }
  handleImageError(event: any) {
    const img = event.target;
    img.src = 'https://via.placeholder.com/300x300.png?text=Imagen+No+Disponible';
  }
}