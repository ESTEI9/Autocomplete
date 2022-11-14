import { TestBed } from '@angular/core/testing';

import { RepoRepository } from './repo.repository';
import { HttpClientModule } from '@angular/common/http';

describe('RepoRepository', () => {
  let service: RepoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(RepoRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
