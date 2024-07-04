import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCrudComponent } from './team-crud.component';

describe('TeamCrudComponent', () => {
  let component: TeamCrudComponent;
  let fixture: ComponentFixture<TeamCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
