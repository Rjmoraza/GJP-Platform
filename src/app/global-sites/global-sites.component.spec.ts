import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSitesComponent } from './global-sites.component';

describe('GlobalSitesComponent', () => {
  let component: GlobalSitesComponent;
  let fixture: ComponentFixture<GlobalSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
