import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, Subject, take, takeUntil } from 'rxjs';
import { AutoCompleteService } from 'src/services/autocomplete/auto-complete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
  ) {
    this.getItems();
  }

  async getResults(query: string) {
      return await this.acService.getItems(query);
  }

  async getItems() {
    this.formGroup.controls['query'].valueChanges.pipe(debounceTime(500), takeUntil(this._onDestroy)).subscribe(async query => {
      this.resetItems();
      this.setItems(query);
    })
  }

  resetItems() {
    this.prevItems = {...this.items};
    this.items = [];
  }

  isValidQuery(q: string): boolean {
    return q.length !== 0  && this.prevItems[0] !== q;
  }

  async setItems(query: string | null) {
    const q = query as string;
    if(this.isValidQuery(q) === false) return;
    const items = await this.getResults(q);
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
