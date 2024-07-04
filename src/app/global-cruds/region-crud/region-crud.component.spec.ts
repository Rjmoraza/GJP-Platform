import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionCRUDComponent } from './region-crud.component';

describe('RegionCRUDComponent', () => {
  let component: RegionCRUDComponent;
  let fixture: ComponentFixture<RegionCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionCRUDComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
