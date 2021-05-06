import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import {catchError, first, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from '../interfaces/playlist';
import {Song} from '../interfaces/song';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent implements OnInit {
  readonly recommended$: Observable<Song[]> =
      this.playlistService.getRecommended();

  ignoreSongEvent = new Subject<Song>();
  ignoreSong$ = this.ignoreSongEvent.asObservable();
  constructor(private playlistService: PlaylistService) {
    this.ignoreSong$.subscribe(
        song => this.playlistService.ignoreSong(song).toPromise());
  }

  ngOnInit(): void {}
}
