import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuezMainComponent } from './juez-main.component';

describe('JuezMainComponent', () => {
  let component: JuezMainComponent;
  let fixture: ComponentFixture<JuezMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuezMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuezMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
