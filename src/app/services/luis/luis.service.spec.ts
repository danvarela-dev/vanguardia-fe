import { TestBed } from '@angular/core/testing';

import { LuisService } from './luis.service';

describe('LuisService', () => {
  let service: LuisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
