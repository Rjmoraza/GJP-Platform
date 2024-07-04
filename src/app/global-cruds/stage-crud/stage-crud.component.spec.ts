import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCrudComponent } from './stage-crud.component';

describe('StageCrudComponent', () => {
  let component: StageCrudComponent;
  let fixture: ComponentFixture<StageCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StageCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
