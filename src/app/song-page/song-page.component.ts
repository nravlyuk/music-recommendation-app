import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable, observable, of, Subject} from 'rxjs';

import {Playlist} from '../interfaces/playlist';
import {SongAtPlaylist} from '../interfaces/requests';
import {Song} from '../interfaces/song';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-song-page',
  templateUrl: './song-page.component.html',
  styleUrls: ['./song-page.component.css']
})
export class SongPageComponent implements OnInit {
  readonly song$: Observable<JSON> = this.playlistService.getSong();

  readonly playlists$: Observable<Playlist[]> =
      this.playlistService.getPlaylists();

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {}

  addToPlaylist(song: JSON, playlist: Playlist): void {
    const songObj: Song = {id: song['id'], title: song['full_title']};
    const sap: SongAtPlaylist = {song: songObj, playlist: playlist};
    this.playlistService.addSong(sap);
  }
  ignore(song: JSON): void {
    // TODO: delete from recommended
    const songObj: Song = {id: song['id'], title: song['full_title']};
    this.playlistService.ignoreSong(songObj);
  }
}
