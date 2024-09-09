import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionCrudComponent } from './region-crud.component';

describe('RegionCRUDComponent', () => {
  let component: RegionCrudComponent;
  let fixture: ComponentFixture<RegionCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
