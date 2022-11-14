import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AutoCompleteService } from './auto-complete.service';

describe('AutoCompleteService', () => {
  let service: AutoCompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(AutoCompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
