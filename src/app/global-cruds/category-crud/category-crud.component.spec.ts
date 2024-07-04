import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCrudComponent } from './category-crud.component';

describe('CategoryCrudComponent', () => {
  let component: CategoryCrudComponent;
  let fixture: ComponentFixture<CategoryCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
