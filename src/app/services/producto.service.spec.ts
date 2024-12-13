import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService, Product } from './producto.service';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    const mockProducts: Product[] = [
      { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null },
      { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200, cantidad: 20, stock: 100, imagen: null }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch a product by ID', () => {
    const mockProduct: Product = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null };

    service.getProduct(1).subscribe(producto => {
      expect(producto).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a new product', () => {
    const mockProduct: Product = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null };

    service.createProduct(mockProduct).subscribe(producto => {
      expect(producto).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update an existing product', () => {
    const mockProduct: Product = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null };

    service.updateProduct(1, mockProduct).subscribe(producto => {
      expect(producto).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  it('should fetch available products', () => {
    const mockProducts: Product[] = [
      { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null },
      { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200, cantidad: 20, stock: 100, imagen: null }
    ];

    service.getAvailableProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/disponibles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should update stock of a product', () => {
    const mockProduct: Product = { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, cantidad: 10, stock: 50, imagen: null };

    service.updateStock(1, 50).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1/stock?cantidad=50`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });
 
});
