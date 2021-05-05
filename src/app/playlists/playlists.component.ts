import {Component, OnInit} from '@angular/core';
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

  deletePlaylistEvent = new Subject<Playlist>();
  deletePlaylist$ = this.deletePlaylistEvent.asObservable();
  deleteSongEvent = new Subject<SongAtPlaylist>();
  deleteSong$ = this.deleteSongEvent.asObservable();

  constructor(private playlistService: PlaylistService) {
    this.deleteSong$.subscribe(
        sap => this.playlistService.deleteSong(sap).toPromise());
    this.deletePlaylist$.subscribe(
        playlist => this.playlistService.deletePlaylist(playlist).toPromise());
  }

  add(name: string): void {
    // TODO: Add playlist name verification

    // TODO: Add 'adding a playlist' logic
  }

  deletePlaylist(playlist: Playlist): void {
    // TODO: Add 'delete a playlist' logic
  }


  ngOnInit(): void {}
}
