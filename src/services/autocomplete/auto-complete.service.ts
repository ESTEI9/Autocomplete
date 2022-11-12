import { Injectable } from '@angular/core';
import { RepoRepository } from 'src/repositories/autocomplete/repo.repository';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {

  constructor(
    public acRepo: RepoRepository
  ) { }

  getItems(query: string, express: boolean = false) {
    try {
      if(express) return this.acRepo.getItems(query);
      return this.acRepo.getPeople(query);
    } catch(error) {
      console.log(error);
      return;
    }
  }
}
