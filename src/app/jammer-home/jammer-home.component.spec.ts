import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerHomeComponent } from './jammer-home.component';

describe('JammerHomeComponent', () => {
  let component: JammerHomeComponent;
  let fixture: ComponentFixture<JammerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
