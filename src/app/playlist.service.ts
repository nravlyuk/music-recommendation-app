import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {catchError, first, map, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from './interfaces/playlist';
import {Song} from './interfaces/song';

@Injectable({providedIn: 'root'})
export class PlaylistService {
  private playlistsUrl =
      'http://localhost:5000/api/playlists';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private playlistsSubject = new Subject<Playlist[]>();
  readonly playlistsReplay = this.playlistsSubject.pipe(shareReplay());
  constructor(private http: HttpClient) {
    this.httpRequestPlaylists();
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.playlistsReplay;
  }

  private async httpRequestPlaylists() {
    // TODO: Implement http request + error handling

    await firstValueFrom(this.http.get<Playlist[]>(this.playlistsUrl)
                             .pipe(
                                 tap(playlists => {
                                   this.playlistsSubject.next(playlists);
                                 }),
                                 ));
  }
}
