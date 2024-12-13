import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProductFormComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no data is provided', () => {
    expect(component.productForm.get('nombre')?.value).toBe('');
    expect(component.productForm.get('descripcion')?.value).toBe('');
    expect(component.productForm.get('precio')?.value).toBe('');
    expect(component.productForm.get('stock')?.value).toBe('');
    expect(component.productForm.get('imagen')?.value).toBe('');
    expect(component.productForm.get('cantidad')?.value).toBe(0);
  });

  it('should initialize form with provided data', () => {
    const mockProduct = {
      id: 1,
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: 100,
      stock: 10,
      imagen: 'test.jpg',
      cantidad: 5
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProductFormComponent, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockProduct }
      ]
    });

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.productForm.get('nombre')?.value).toBe('Test Product');
    expect(component.productForm.get('descripcion')?.value).toBe('Test Description');
    expect(component.productForm.get('precio')?.value).toBe(100);
    expect(component.productForm.get('stock')?.value).toBe(10);
    expect(component.productForm.get('imagen')?.value).toBe('test.jpg');
    expect(component.productForm.get('cantidad')?.value).toBe(5);
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.productForm.controls['nombre'].setValue('');
    component.productForm.controls['descripcion'].setValue('');
    component.productForm.controls['precio'].setValue('');
    component.productForm.controls['stock'].setValue('');

    expect(component.productForm.valid).toBeFalse();
  });

  it('should mark form as valid when required fields are filled', () => {
    component.productForm.patchValue({
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: 100,
      stock: 10
    });

    expect(component.productForm.valid).toBeTrue();
  });

  it('should call dialogRef.close when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call dialogRef.close with form value when onSubmit is called with valid form', () => {
    component.productForm.patchValue({
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: '100',
      stock: '10',
      imagen: 'test.jpg',
      cantidad: '5'
    });

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: 100, // Note: converted to number
      stock: 10,   // Note: converted to number
      imagen: 'test.jpg',
      cantidad: 5
    });
  });

  it('should not call dialogRef.close when form is invalid on submit', () => {
    component.productForm.patchValue({
      nombre: '', // required field empty
      descripcion: 'Test Description',
      precio: 100,
      stock: 10
    });

    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should validate price is not negative', () => {
    component.productForm.patchValue({
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: -100,
      stock: 10
    });

    expect(component.productForm.get('precio')?.errors).toBeTruthy();
  });

  it('should validate stock is not negative', () => {
    component.productForm.patchValue({
      nombre: 'Test Product',
      descripcion: 'Test Description',
      precio: 100,
      stock: -10
    });

    expect(component.productForm.get('stock')?.errors).toBeTruthy();
  });


  
  
});