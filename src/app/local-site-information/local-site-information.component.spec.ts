import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalSiteInformationComponent } from './local-site-information.component';

describe('LocalSiteInformationComponent', () => {
  let component: LocalSiteInformationComponent;
  let fixture: ComponentFixture<LocalSiteInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalSiteInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalSiteInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
