import { TestBed } from '@angular/core/testing';

import { RepoRepository } from './repo.repository';

describe('RepoRepository', () => {
  let service: RepoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepoRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
