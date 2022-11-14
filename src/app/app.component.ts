import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteService } from 'src/services/autocomplete/auto-complete.service';
import { Results, WookieResults, Person } from './results.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Autocomplete';
  people: string[] = [];
  selectedItem: string = "";
  isLoading = false;
  formGroup = new FormGroup({
    query: new FormControl('')
  });

  private _onDestroy = new Subject<void>();

  constructor(
    public acService: AutoCompleteService
  ) {}

  ngOnInit(): void {
    this.listenForResults();
  }

  async getPeople(query: string): Promise<WookieResults> {
    return await this.acService.getPeople(query);
  }

  async getItems(query: string): Promise<Results> {
      return await this.acService.getItems(query);
  }

  getQueryValues():Observable<any> {
    return this.formGroup.controls['query'].valueChanges.pipe(debounceTime(500), takeUntil(this._onDestroy));
  }

  listenForResults() {
    this.getQueryValues().subscribe((query: string) => {
      this.handleResults(query);
    })
  }

  isValidQuery(q: string): boolean {
    return q.length !== 0 && this.selectedItem !== q;
  }

  async setPeople(q: string) {
    this.isLoading = true;
    const people = await this.getPeople(q);
    this.people = people.results?.map((person: Person) => person.name);
    this.isLoading = false;
  }

  handleResults(query: string) {
    this.people = [];
    const validQuery = this.isValidQuery(query);
    if(validQuery) this.setPeople(query);
  }
  
  // Codility wanted a fn like this on click, but it's dumb for an "autocomplete", so I didn't implement it.
  // alert(person: string) {
  //   window.alert(person);
  // }

  autoFill(item?: string) {
    const fill = item ?? this.people[0];
    this.selectedItem = fill;
    this.formGroup.controls['query'].setValue(fill);
  }
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
