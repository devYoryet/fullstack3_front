// src/app/services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    stock: number;
    imagen: string | null;
    compra?: any; // Lo hacemos opcional porque no siempre lo necesitamos
  }
  @Injectable({
    providedIn: 'root'
  })
  export class ProductoService {
    private apiUrl = 'http://localhost:8080/api/productos';
  
    constructor(private http: HttpClient) {}
  
    getProducts(p0?: { limit: number }): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl, { withCredentials: true }).pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Error 401: No autorizado. Verifica tus credenciales.');
          }
          return throwError(() => error);
        })
      );
    }
  
    getProduct(id: number): Observable<Product> {
      return this.http.get<Product>(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
  
    createProduct(product: Product): Observable<Product> {
      return this.http.post<Product>(this.apiUrl, product, { withCredentials: true });
    }
  
    updateProduct(id: number, product: Product): Observable<Product> {
      const productToSend = {
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        cantidad: product.cantidad || 0,
        imagen: product.imagen || null
      };
  
      return this.http.put<Product>(`${this.apiUrl}/${id}`, productToSend, { withCredentials: true });
    }
  
    deleteProduct(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
    getAvailableProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.apiUrl}/disponibles`);
    }
  
    updateStock(id: number, quantity: number): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/${id}/stock?cantidad=${quantity}`, {});
    }
    // En producto.service.ts
  
    getImageUrl(product: Product): string {
      if (!product.imagen) {
        return 'https://via.placeholder.com/300x300.png?text=No+Image';
      }
    
      if (product.imagen.startsWith('http')) {
        return product.imagen;
      }
    
      // Para imágenes que no cargan, retornar un placeholder
      return 'https://via.placeholder.com/300x300.png?text=' + encodeURIComponent(product.nombre);
    }
  }