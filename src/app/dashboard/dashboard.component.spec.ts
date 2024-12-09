import { ComponentFixture, TestBed, waitForAsync,flush,fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductoService } from '../services/producto.service';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;
  let authService: jasmine.SpyObj<AuthService>;
  let productoService: jasmine.SpyObj<ProductoService>;
  let router: jasmine.SpyObj<Router>;

  const mockProducts = [
    { id: 1, nombre: 'Test 1', descripcion: 'Test 1', precio: 100, stock: 5, imagen: 'test1.jpg', cantidad: 0 },
    { id: 2, nombre: 'Test 2', descripcion: 'Test 2', precio: 200, stock: 10, imagen: 'test2.jpg', cantidad: 0 }
  ];

  beforeEach(async () => {
    const snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'logout', 'getBasicAuthHeader']);
    const productoServiceSpy = jasmine.createSpyObj('ProductoService', ['getProducts', 'deleteProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    authServiceSpy.isAdmin.and.returnValue(true);
    authServiceSpy.getBasicAuthHeader.and.returnValue('Basic test');

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        DashboardComponent
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackbarSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProductoService, useValue: productoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    matSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    productoService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should load products successfully', fakeAsync(() => {
    productoService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    flush();
    expect(component.products).toEqual(mockProducts);
  }));
  
  it('should delete product when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    productoService.deleteProduct.and.returnValue(of(void 0));
    component.products = [...mockProducts];
    const productToDelete = mockProducts[0];
    
    component.deleteProduct(productToDelete);
    
    expect(productoService.deleteProduct).toHaveBeenCalledWith(productToDelete.id);
  });

  it('should not delete product when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const productToDelete = mockProducts[0];
    component.products = [...mockProducts];
    
    component.deleteProduct(productToDelete);
    
    expect(productoService.deleteProduct).not.toHaveBeenCalled();
  });

  it('should handle logout', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
