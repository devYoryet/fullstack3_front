import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardUserComponent } from './dashboard-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductoService } from '../services/producto.service';
import { of, throwError } from 'rxjs';

describe('DashboardUserComponent', () => {
  let component: DashboardUserComponent;
  let fixture: ComponentFixture<DashboardUserComponent>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;
  let authService: jasmine.SpyObj<AuthService>;
  let productoService: jasmine.SpyObj<ProductoService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear spies
    matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    authService = jasmine.createSpyObj('AuthService', ['isUser', 'logout']);
    productoService = jasmine.createSpyObj('ProductoService', ['getProducts']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Configuración por defecto
    authService.isUser.and.returnValue(true);
    productoService.getProducts.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        DashboardUserComponent
      ],
      providers: [
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: AuthService, useValue: authService },
        { provide: ProductoService, useValue: productoService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if user is not authenticated', () => {
    authService.isUser.and.returnValue(false);
    component.ngOnInit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load products successfully', () => {
    const mockProducts = [
      { id: 1, nombre: 'Test', descripcion: 'Test', precio: 100, stock: 5, imagen: 'test.jpg', cantidad: 0 }
    ];
    productoService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();
    expect(component.products).toEqual(mockProducts);
  });

  it('should add product to cart and update quantity', () => {
    const product = {
      id: 1,
      nombre: 'Test',
      descripcion: 'Test',
      precio: 100,
      stock: 5,
      imagen: 'test.jpg',
      cantidad: 0
    };

    // Primera adición
    component.addToCart(product);
    expect(component.cart.length).toBe(1);
    expect(component.cart[0].quantity).toBe(1);

    // Segunda adición del mismo producto
    component.addToCart(product);
    expect(component.cart[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    const products = [
      { 
        product: { id: 1, nombre: 'P1', descripcion: 'D1', precio: 100, stock: 5, imagen: 'img1.jpg', cantidad: 0 },
        quantity: 2 
      },
      { 
        product: { id: 2, nombre: 'P2', descripcion: 'D2', precio: 200, stock: 5, imagen: 'img2.jpg', cantidad: 0 },
        quantity: 1 
      }
    ];
    component.cart = products;
    expect(component.getTotal()).toBe(400);
  });
});