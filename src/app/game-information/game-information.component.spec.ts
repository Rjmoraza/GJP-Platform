import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInformationComponent } from './game-information.component';

describe('GameInformationComponent', () => {
  let component: GameInformationComponent;
  let fixture: ComponentFixture<GameInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
