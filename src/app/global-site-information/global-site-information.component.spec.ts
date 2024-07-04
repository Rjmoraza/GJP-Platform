import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSiteInformationComponent } from './global-site-information.component';

describe('GlobalSiteInformationComponent', () => {
  let component: GlobalSiteInformationComponent;
  let fixture: ComponentFixture<GlobalSiteInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSiteInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalSiteInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
