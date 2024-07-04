import { TestBed } from '@angular/core/testing';

import { GamejamService } from './gamejam.service';

describe('GamejamService', () => {
  let service: GamejamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamejamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
