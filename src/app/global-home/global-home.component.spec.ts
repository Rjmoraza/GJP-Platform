import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalHomeComponent } from './global-home.component';

describe('GlobalHomeComponent', () => {
  let component: GlobalHomeComponent;
  let fixture: ComponentFixture<GlobalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
