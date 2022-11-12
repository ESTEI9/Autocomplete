import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteService } from 'src/services/autocomplete/auto-complete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Autocomplete';
  items: string[] = [];
  selectedItem: string = "";
  isLoading = false;
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
      this.handleResults(query);
    })
  }

  isValidQuery(q: string): boolean {
    return q.length !== 0 && this.selectedItem !== q;
  }

  async setItems(q: string) {
    this.isLoading = true;
    const items = await this.getRemoteItems(q);
    this.items = items.results?.map((item:any) => item.name);
    this.isLoading = false;
  }

  async handleResults(query: string | null) {
    this.items = [];
    const q = query as string;
    if(this.isValidQuery(q) === false) return;
    this.setItems(q);
  }
  
  // Codility wanted a fn like this on click, but it's dumb for an "autocomplete", so I didn't implement it.
  // alert(item: string) {
  //   window.alert(item);
  // }

  autoFill(item?: string) {
    const fill = item ?? this.items[0];
    this.selectedItem = fill;
    this.formGroup.controls['query'].setValue(fill);
  }
  
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
