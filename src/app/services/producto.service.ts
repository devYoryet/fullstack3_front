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

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const authHeader = this.authService.getBasicAuthHeader();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': authHeader || '',
      'Accept': 'application/json'
    });
  }

  getProducts(p0?: { limit: number; }): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error en getProducts:', error);
        return throwError(() => error);
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    // Limpiamos el objeto antes de enviarlo
    const productToSend = {
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      cantidad: product.cantidad || 0,
      imagen: product.imagen || null
    };
  
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productToSend, {
      headers: this.getHeaders()
    });
  }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}