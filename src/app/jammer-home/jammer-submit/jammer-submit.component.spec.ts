import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerSubmitComponent } from './jammer-submit.component';

describe('JammerSubmitComponent', () => {
  let component: JammerSubmitComponent;
  let fixture: ComponentFixture<JammerSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerSubmitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
