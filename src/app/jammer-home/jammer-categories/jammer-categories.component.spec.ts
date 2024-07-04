import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerCategoriesComponent } from './jammer-categories.component';

describe('JammerCategoriesComponent', () => {
  let component: JammerCategoriesComponent;
  let fixture: ComponentFixture<JammerCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
