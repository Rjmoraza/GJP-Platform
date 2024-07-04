import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeCrudComponent } from './theme-crud.component';

describe('ThemeCrudComponent', () => {
  let component: ThemeCrudComponent;
  let fixture: ComponentFixture<ThemeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
