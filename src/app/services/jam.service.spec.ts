import { TestBed } from '@angular/core/testing';

import { JamService } from './jam.service';

describe('JamService', () => {
  let service: JamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
