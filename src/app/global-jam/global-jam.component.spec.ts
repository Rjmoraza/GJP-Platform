import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalJamComponent } from './global-jam.component';

describe('GlobalJamComponent', () => {
  let component: GlobalJamComponent;
  let fixture: ComponentFixture<GlobalJamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalJamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalJamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
