import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import {catchError, first, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from '../interfaces/playlist';
import {SongAtPlaylist} from '../interfaces/requests';
import {Song} from '../interfaces/song';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  readonly playlists$: Observable<Playlist[]> =
      this.playlistService.getPlaylists();

  addPlaylistEvent = new Subject<Playlist>();
  addPlaylist$ = this.addPlaylistEvent.asObservable();
  deletePlaylistEvent = new Subject<Playlist>();
  deletePlaylist$ = this.deletePlaylistEvent.asObservable();
  deleteSongEvent = new Subject<SongAtPlaylist>();
  deleteSong$ = this.deleteSongEvent.asObservable();

  opened: boolean;
  playlistNameControl = new FormControl('', [Validators.required]);

  constructor(private playlistService: PlaylistService) {
    this.addPlaylist$.subscribe(
        playlist => this.playlistService.addPlaylist(playlist).toPromise());
    this.deleteSong$.subscribe(
        sap => this.playlistService.deleteSong(sap).toPromise());
    this.deletePlaylist$.subscribe(
        playlist => this.playlistService.deletePlaylist(playlist).toPromise());
  }

  addPlaylist(name: string, description: string): void {
    this.playlistNameControl.markAsTouched();
    if (this.playlistNameControl.invalid) {
      return;
    }
    const playlist:
        Playlist = {id: 0, name: name, description: description, songs: []};
    this.addPlaylistEvent.next(playlist);

    this.opened = false;
  }


  ngOnInit(): void {}

  getErrorMessage() {
    if (this.playlistNameControl.hasError('required')) {
      return 'You must enter a value';
    }
  }
}
