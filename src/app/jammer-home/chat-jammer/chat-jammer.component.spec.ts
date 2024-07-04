import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJammerComponent } from './chat-jammer.component';

describe('ChatJammerComponent', () => {
  let component: ChatJammerComponent;
  let fixture: ComponentFixture<ChatJammerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJammerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatJammerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
