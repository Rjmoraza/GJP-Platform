import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCRUDsComponent } from './global-cruds.component';

describe('GlobalCRUDsComponent', () => {
  let component: GlobalCRUDsComponent;
  let fixture: ComponentFixture<GlobalCRUDsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalCRUDsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalCRUDsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
