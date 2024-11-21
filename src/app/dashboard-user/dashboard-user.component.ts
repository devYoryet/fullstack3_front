import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
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

  cart: CartItem[] = [];
  showCart = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {}

  ngOnInit() {
    if (!this.authService.isUser()) {
      this.router.navigate(['/login']);
      return;
    }

    
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    }
  }
  addToCart(product: Product) {
    const cartItem = this.cart.find(item => item.product.id === product.id);
    
    if (cartItem) {
      if (cartItem.quantity < product.stock) {
        cartItem.quantity++;
        this.snackBar.open('Cantidad actualizada en el carrito', 'Cerrar', {
          duration: 2000
        });
      } else {
        this.snackBar.open('Stock no disponible', 'Cerrar', {
          duration: 2000
        });
      }
    } else {
      this.cart.push({ product, quantity: 1 });
      this.snackBar.open('Producto agregado al carrito', 'Cerrar', {
        duration: 2000
      });
    }
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
  

  removeFromCart(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart = this.cart.filter(i => i.product.id !== item.product.id);
    }
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    this.snackBar.open('Producto removido del carrito', 'Cerrar', {
      duration: 2000
    });
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => {
      return total + (item.product.precio * item.quantity);
    }, 0);
  }

  checkout() {
    if (this.cart.length === 0) {
      this.snackBar.open('El carrito está vacío', 'Cerrar', {
        duration: 2000
      });
      return;
    }
    
    // Aquí iría la lógica de checkout
    this.snackBar.open('¡Compra realizada con éxito!', 'Cerrar', {
      duration: 2000
    });
    this.cart = [];
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cart');
    }
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000
    });
    this.router.navigate(['/login']);
  }
}
