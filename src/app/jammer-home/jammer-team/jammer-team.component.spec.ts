import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerTeamComponent } from './jammer-team.component';

describe('JammerTeamComponent', () => {
  let component: JammerTeamComponent;
  let fixture: ComponentFixture<JammerTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
