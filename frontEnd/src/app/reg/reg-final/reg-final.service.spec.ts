import { TestBed } from '@angular/core/testing';

import { RegFinalService } from './reg-final.service';

describe('RegFinalService', () => {
  let service: RegFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
