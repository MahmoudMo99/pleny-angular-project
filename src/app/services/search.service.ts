import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  // A BehaviorSubject to hold the current search term
  private searchTerm = new BehaviorSubject<string>('');

  // An observable of the search term, allowing other components to subscribe and react to changes
  currentSearchTerm = this.searchTerm.asObservable();

  constructor() {}

  // Method to update the current search term
  // This method will be called whenever the search term needs to be updated
  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
}
