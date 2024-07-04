import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JammerCreateTeamComponent } from './jammer-create-team.component';

describe('JammerCreateTeamComponent', () => {
  let component: JammerCreateTeamComponent;
  let fixture: ComponentFixture<JammerCreateTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JammerCreateTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JammerCreateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
