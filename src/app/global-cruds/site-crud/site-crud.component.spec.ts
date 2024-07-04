import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCrudComponent } from './site-crud.component';

describe('SiteCrudComponent', () => {
  let component: SiteCrudComponent;
  let fixture: ComponentFixture<SiteCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
