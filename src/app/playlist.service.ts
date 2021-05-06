import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {catchError, first, map, shareReplay, tap} from 'rxjs/operators';

import {Playlist} from './interfaces/playlist';
import {SessionRequest, SongAtPlaylist} from './interfaces/requests';
import {Song} from './interfaces/song';

@Injectable({providedIn: 'root'})
export class PlaylistService {
  private playlistsUrl =
      'http://localhost:5000/api/playlists';  // URL to web api
  private recommendedUrl =
      'http://localhost:5000/api/recommended';              // URL to web api
  private ignoreUrl = 'http://localhost:5000/api/ignored';  // URL to web api
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


  deleteSong(sap: SongAtPlaylist): Observable<SongAtPlaylist>{
    // TODO: Implement http request + error handling
    return this.http.delete<SongAtPlaylist>(this.playlistsUrl, this.httpOptions)
        .pipe(tap(_ => this._deleteSong(sap)))
  }

  _deleteSong(sap: SongAtPlaylist): void{firstValueFrom(
      this.getPlaylists().pipe(tap((playlists: Playlist[]) => {
        const pl_index: number =
            playlists.findIndex(x => x.id === sap.playlist.id);
        const s_index: number =
            playlists[pl_index].songs.findIndex(x => x.id === sap.song.id);
        playlists[pl_index].songs.splice(s_index, 1)
      })))}

  deletePlaylist(playlist: Playlist): Observable<Playlist>{
    // TODO: Implement http request + error handling
    return this.http.delete<Playlist>(this.playlistsUrl, this.httpOptions)
        .pipe(tap(_ => this._deletePlaylist(playlist)))
  }

  _deletePlaylist(playlist: Playlist): void{firstValueFrom(
      this.getPlaylists().pipe(tap((playlists: Playlist[]) => {
        const index: number = playlists.findIndex(x => x.id === playlist.id);
        playlists.splice(index, 1)
      })))}

  ignoreSong(song: Song): Observable<Song>{
    // TODO: Implement http request + error handling
    return this.http.post<Song>(this.ignoreUrl, this.httpOptions)
        .pipe(tap(_ => this._ignoreSong(song)))
  }

  _ignoreSong(song: Song): void {
    firstValueFrom(this.getRecommended().pipe(tap((songs: Song[]) => {
      const index: number = songs.findIndex(x => x.id === song.id);
      songs.splice(index, 1)
    })));
    firstValueFrom(this.getIgnored().pipe(tap((songs: Song[]) => {
      songs.push(song);
    })));
  }
}
