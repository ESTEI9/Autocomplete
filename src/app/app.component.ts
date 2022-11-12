import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteService } from 'src/services/autocomplete/auto-complete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Autocomplete';
  items: string[] = [];
  prevItems: string[] = [];
  isLoading = new BehaviorSubject<boolean>(false);
  formGroup = new FormGroup({
    query: new FormControl('')
  });

  private _onDestroy = new Subject<void>();

  constructor(
    private acService: AutoCompleteService
  ) {}

  ngOnInit(): void {
    this.listenForResults();
  }

  async getRemoteItems(query: string) {
      return await this.acService.getItems(query);
  }

  getQueryValues():Observable<string | null> {
    return this.formGroup.controls['query'].valueChanges.pipe(debounceTime(500), takeUntil(this._onDestroy));
  }

  async listenForResults() {
    this.getQueryValues().subscribe(async query => {
      this.setItems(query);
    })
  }

  resetLocalItems() {
    this.prevItems = {...this.items};
    this.items = [];
  }

  isValidQuery(q: string): boolean {
    return q.length !== 0  && this.prevItems[0] !== q;
  }

  async setItems(query: string | null) {
    this.resetLocalItems();
    const q = query as string;
    if(this.isValidQuery(q) === false) return;
    const items = await this.getRemoteItems(q);
    this.items = items.results?.map((item:any) => item.name);
  }
  
  // Codility wanted a fn like this on click, but it's dumb for an "autocomplete", so I didn't implement it.
  // alert(item: string) {
  //   window.alert(item);
  // }

  autoFill(item?: string) {
    const fill = item ?? this.items[0];
    this.formGroup.controls['query'].setValue(fill);
  }
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
