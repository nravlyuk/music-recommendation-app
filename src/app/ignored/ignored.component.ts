import {Component, OnInit} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {catchError, first, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from '../interfaces/playlist';
import {Song} from '../interfaces/song';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-ignored',
  templateUrl: './ignored.component.html',
  styleUrls: ['./ignored.component.css']
})
export class IgnoredComponent implements OnInit {
  readonly ignored$: Observable<Song[]> = this.playlistService.getIgnored();

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {}

  deleteSong(song: Song): void {
    // TODO: Add 'delete a song from ignored list' logic
  }
}
