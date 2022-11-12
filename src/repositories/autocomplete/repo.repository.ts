import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RepoRepository {

  url = '/api/items?q='
  wookieURL = 'https://swapi.dev/api/people/?search=';

  constructor(
    private http: HttpClient
  ) { }

  async getItems(query: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.url}${query}`));
  }

  async getPeople(query: string): Promise<any> {
    return await lastValueFrom(this.http.get(`${this.wookieURL}${query}`));
  }
}
