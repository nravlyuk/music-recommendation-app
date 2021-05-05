import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {catchError, first, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from '../interfaces/playlist';
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

  constructor(private playlistService: PlaylistService) {}

  add(name: string): void {
    // TODO: Add playlist name verification

    // TODO: Add 'adding a playlist' logic
  }

  deletePlaylist(playlist: Playlist): void {
    // TODO: Add 'delete a playlist' logic
  }

  deleteSong(playlist: Playlist, song: Song): void {
    // TODO: Add 'delete a song' logic
  }

  ngOnInit(): void {}
}
