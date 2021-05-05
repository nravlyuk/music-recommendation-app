import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {catchError, first, map, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from './interfaces/playlist';
import {SessionRequest} from './interfaces/request';
import {Song} from './interfaces/song';

@Injectable({providedIn: 'root'})
export class PlaylistService {
  private playlistsUrl =
      'http://localhost:5000/api/playlists';  // URL to web api
  private recommendedUrl =
      'http://localhost:5000/api/recommended';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private playlistsSubject = new Subject<Playlist[]>();
  private ignoredSubject = new Subject<Song[]>();
  private recommendedSubject = new Subject<Song[]>();
  readonly playlistsReplay = this.playlistsSubject.pipe(shareReplay());
  readonly ignoredReplay = this.ignoredSubject.pipe(shareReplay());
  readonly recommendedReplay = this.recommendedSubject.pipe(shareReplay());
  constructor(private http: HttpClient) {
    this.httpRequestPlaylists();
    this.playlistsReplay.subscribe(
        (playlists) => this.httpRequestRecommended(playlists));
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.playlistsReplay;
  }

  getIgnored(): Observable<Song[]> {
    return this.ignoredReplay;
  }

  getRecommended(): Observable<Song[]> {
    return this.recommendedReplay;
  }

  private async httpRequestPlaylists() {
    // TODO: Implement http request + error handling

    await firstValueFrom(this.http.get<SessionRequest>(this.playlistsUrl)
                             .pipe(tap((response: SessionRequest) => {
                               this.playlistsSubject.next(
                                   response['playlists']);
                               this.ignoredSubject.next(response['ignored']);
                             })));
  }

  private async httpRequestRecommended(playlists: Playlist[]) {
    // TODO: Implement http request + error handling

    await firstValueFrom(
        this.http.post<Song[]>(this.recommendedUrl, playlists, this.httpOptions)
            .pipe(tap((response: Song[]) => {
              this.recommendedSubject.next(response);
            })));
  }
}
