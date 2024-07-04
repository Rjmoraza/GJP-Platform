import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalHomeComponent } from './local-home.component';

describe('LocalHomeComponent', () => {
  let component: LocalHomeComponent;
  let fixture: ComponentFixture<LocalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
