import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerThemesComponent } from './jammer-themes.component';

describe('JammerThemesComponent', () => {
  let component: JammerThemesComponent;
  let fixture: ComponentFixture<JammerThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerThemesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
