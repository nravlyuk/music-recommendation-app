import {animate, style, transition, trigger} from '@angular/animations';
import {catchError, debounceTime, map, mergeMap, mergeMapTo, shareReplay, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-song-page',
  templateUrl: './song-page.component.html',
  styleUrls: ['./song-page.component.css'],
  animations: [trigger(
      'slideInOut',
      [
        transition(
            ':enter',
            [
              style({transform: 'translateX(100%)'}),
              animate('500ms ease-in', style({transform: 'translateX(0%)'}))
            ]),
        transition(
            ':leave',
            [animate('300ms ease-in', style({transform: 'translateX(100%)'}))])
      ])]
})
export class SongPageComponent implements OnInit {
  readonly song$: Observable<JSON> = this.playlistService.getSong();

  private visible = new Subject<boolean>();
  readonly visible$ = this.visible.pipe(shareReplay());

  readonly playlists$: Observable<Playlist[]> =
      this.playlistService.getPlaylists();

  addSongEvent = new Subject<SongAtPlaylist>();
  addSong$ = this.addSongEvent.asObservable();

  constructor(private playlistService: PlaylistService) {
    this.addSong$.subscribe(
        sap => this.playlistService.addSong(sap).toPromise());
  }

  ngOnInit(): void {}

  addToPlaylist(song: JSON, playlist: Playlist): void {
    const songObj: Song = {
      id: song['id'],
      full_title: song['full_title'],
      title: song['title'],
      primary_artist_name: song['primary_artist']['name'],
      header_image_url: song['header_image_url']
    };
    const sap: SongAtPlaylist = {song: songObj, playlist: playlist};
    this.addSongEvent.next(sap);
  }
  ignore(song: JSON): void {
    // TODO: delete from recommended
    const songObj: Song = {
      id: song['id'],
      full_title: song['full_title'],
      title: song['title'],
      primary_artist_name: song['primary_artist']['name'],
      header_image_url: song['header_image_url']
    };
    this.playlistService.ignoreSong(songObj);
  }

  closePage(): void {
    this.visible.next(false);
  }
}
import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable, observable, of, Subject} from 'rxjs';

import {Playlist} from '../interfaces/playlist';
import {SongAtPlaylist} from '../interfaces/requests';
import {Song} from '../interfaces/song';
import {PlaylistService} from '../playlist.service';
