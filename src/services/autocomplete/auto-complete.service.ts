import { Injectable } from '@angular/core';
import { Results, WookieResults } from 'src/app/results.model';
import { RepoRepository } from 'src/repositories/autocomplete/repo.repository';
import { asyncWrapper } from 'src/utils';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {

  constructor(
    public acRepo: RepoRepository
  ) { }

  async getItems(query: string): Promise<Results> {
    const [items, error] = await asyncWrapper(this.acRepo.getItems(query));
    if(error) console.log(error);
    return items;
  }

  async getPeople(query: string): Promise<WookieResults> {
      const [people, error] = await asyncWrapper(this.acRepo.getPeople(query));
      if(error) console.log(error.message);
      return people;
  }
}
