import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamejamCrudComponent } from './gamejam-crud.component';

describe('GamejamCrudComponent', () => {
  let component: GamejamCrudComponent;
  let fixture: ComponentFixture<GamejamCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamejamCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamejamCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
