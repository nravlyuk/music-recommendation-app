import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, observable, of} from 'rxjs';
import {catchError, debounceTime, map, mergeMap, mergeMapTo, startWith, switchMap} from 'rxjs/operators';

import {GeniusResponse, Hit, Hits} from '../interfaces/genius';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-genius-search',
  templateUrl: './genius-search.component.html',
  styleUrls: ['./genius-search.component.css']
})
export class GeniusSearchComponent implements OnInit {
  public geniusAutoComplete$: Observable<Hits> = null;
  public autoCompleteControl = new FormControl();
  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.geniusAutoComplete$ = this.autoCompleteControl.valueChanges.pipe(
        startWith(''), debounceTime(300), switchMap((value: string) => {
          if (value !== '') {
            return this.search(value);
          } else {
            return of(null);
          }
        }));
  }

  search(value: string): Observable<Hit[]> {
    // TODO: catch errors
    return this.playlistService.searchGenius(value.toLowerCase())
        .pipe(
            map((results: GeniusResponse) => results.response.hits),
            catchError(_ => {
              return of(null);
            }));
  }
}
