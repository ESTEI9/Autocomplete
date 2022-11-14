import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { MockAutoCompleteService } from 'src/services/autocomplete/auto-complete.mock.service';
import { AutoCompleteService } from 'src/services/autocomplete/auto-complete.service';
import { AppComponent } from './app.component';
import { Person, Results, WookieResults } from './results.model';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let people: WookieResults = {
    count: 1,
    next: null,
    previous: null,
    results: [{
      ...new Person(),
    name: 'Luke Skywalker'
    }]
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AutoCompleteService, useClass: MockAutoCompleteService },
      ],
      imports: [ HttpClientModule, ReactiveFormsModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Autocomplete'`, () => {
    expect(component.title).toEqual('Autocomplete');
  });

  describe('ngOnInit', () => {
    it('should call listenForResults()', () => {
      const listenSpy = spyOn(component, 'listenForResults');
      component.ngOnInit();
      expect(listenSpy).toHaveBeenCalled();
    });
  });

  describe('getPeople', () => {
    it('should return people from the autocomplete service', async () => {
      spyOn<AutoCompleteService, any>(component.acService, 'getPeople').and.resolveTo(people);

      const expected = await component.getPeople("");
      expect(expected).toEqual(people);
    });
  });

  describe('getItems', () => {
    it('should return items from the autocomplete service', async () => {
      const items = new Results();
      spyOn<AutoCompleteService, any>(component.acService, 'getItems').and.resolveTo(items);

      const expected = await component.getItems("");
      expect(expected).toEqual(items);
    });
  });

  describe('listenForResults', () => {
    it('should call handleResults when the formcontrol "query" changes value', fakeAsync(() => {
      const handleSpy = spyOn(component, 'handleResults');
      component.listenForResults();
      const query = 'luke';

      component.formGroup.get('query')?.setValue(query);
      tick(500);
      expect(handleSpy).toHaveBeenCalledWith(query)
    }));
  });

  describe('isValidQuery', () => {
    it('should return false if the query is an empty string', () => {
      const query = "";
      component.selectedItem = "";
      const expected = component.isValidQuery(query);
      expect(expected).toBeFalse();
    });

    it('should return false if the query is an empty string and the selectedItem does not match the query', () => {
      const query = "";
      component.selectedItem = "luke";
      const expected = component.isValidQuery(query);
      expect(expected).toBeFalse();
    });

    it('should return false if the query is not an empty string, but the query matches the selectedItem', () => {
      const query = "luke";
      component.selectedItem = "luke";
      const expected = component.isValidQuery(query);
      expect(expected).toBeFalse();
    });

    it('should return true if the query is not an empty string and query does not match the selectedItem', () => {
      const query = "luke";
      component.selectedItem = "han";

      const expected = component.isValidQuery(query);
      expect(expected).toBeTrue();
    });
  });

  describe('setPeople', () => {
    it('should map the people results to an array of names', async () => {
      spyOn(component, 'getPeople').and.resolveTo(people);

      await component.setPeople("luke");

      expect(component.people).toEqual(['Luke Skywalker']);
    });
  });

  describe('handleResults', () => {
    it('should reset component.people to an empty array and do nothing else if does not have a valid query', () => {
      spyOn(component, 'isValidQuery').and.returnValue(false);
      const setPeopleSpy = spyOn(component, 'setPeople');
      component.handleResults('');

      expect(component.people).toEqual([]);
      expect(setPeopleSpy).not.toHaveBeenCalled();
    });

    it('should reset component.people to an empty array and call setPeople if it has a valid query', () => {
      spyOn(component, 'isValidQuery').and.returnValue(true);
      const setPeopleSpy = spyOn(component, 'setPeople');
      const query = 'luke';
      component.handleResults(query);

      expect(component.people).toEqual([]);
      expect(setPeopleSpy).toHaveBeenCalledWith(query);
    });
  });

  describe('autoFill', () => {
    it('should set the component.selectedItem and the "query" formcontrol to the provided value', () => {
      const item = "Luke SkyWalker";
      const ctrl = component.formGroup.get('query');
      component.autoFill(item);

      expect(component.selectedItem).toBe(item);
      expect(ctrl?.value).toBe(item);
    });

    it('should set component.selectedItem and the "query" formcontrol to the first item in the people array if there is no provided value', () => {
      const han = "Han Solo";
      component.people = [han];
      const ctrl = component.formGroup.get('query');
      component.autoFill();

      expect(component.selectedItem).toBe(han);
      expect(ctrl?.value).toBe(han);
    });
  });
});
