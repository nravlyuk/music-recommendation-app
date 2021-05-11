import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, of, Subject} from 'rxjs';
import {catchError, first, map, shareReplay, switchMap, tap} from 'rxjs/operators';

import {GeniusResponse} from './interfaces/genius';
import {Playlist} from './interfaces/playlist';
import {SessionRequest, SongAtPlaylist} from './interfaces/requests';
import {Song} from './interfaces/song';

@Injectable({providedIn: 'root'})
export class PlaylistService {
  private PRODUCTION = false;
  private domain = (this.PRODUCTION) ?
      'https://striped-guard-312322.wl.r.appspot.com' :
      'http://localhost:5000';
  private playlistsUrl = this.domain + '/api/playlists';
  private recommendedUrl = this.domain + '/api/recommended';
  private ignoreUrl = this.domain + '/api/ignored';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  httpOptionsCred = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true
  };

  private playlistsSubject = new Subject<Playlist[]>();
  private ignoredSubject = new Subject<Song[]>();
  private recommendedSubject = new Subject<Song[]>();
  private songSubject = new Subject<JSON>();
  readonly playlistsReplay = this.playlistsSubject.pipe(shareReplay());
  readonly ignoredReplay = this.ignoredSubject.pipe(shareReplay());
  readonly recommendedReplay = this.recommendedSubject.pipe(shareReplay());
  readonly songReplay = this.songSubject.pipe(shareReplay());
  private accessToken: string = '';
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

  getSong(): Observable<JSON> {
    return this.songReplay;
  }

  private async httpRequestPlaylists() {
    // TODO: Implement http request + error handling

    await firstValueFrom(
        this.http
            .get<SessionRequest>(this.playlistsUrl, {withCredentials: true})
            .pipe(tap((response: SessionRequest) => {
              this.playlistsSubject.next(response['playlists']);
              this.ignoredSubject.next(response['ignored']);
              this.accessToken = response['access_token'];
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
    return this.http
        .delete<SongAtPlaylist>(this.playlistsUrl, this.httpOptionsCred)
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
    return this.http.delete<Playlist>(this.playlistsUrl, this.httpOptionsCred)
        .pipe(tap(_ => this._deletePlaylist(playlist)))
  }

  _deletePlaylist(playlist: Playlist): void{firstValueFrom(
      this.getPlaylists().pipe(tap((playlists: Playlist[]) => {
        const index: number = playlists.findIndex(x => x.id === playlist.id);
        playlists.splice(index, 1)
      })))}

  ignoreSong(song: Song) {
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

  async addSong(sap: SongAtPlaylist) {
    // TODO: Implement http request + error handling
    // TODO: Check if song is in a playlist already
    await firstValueFrom(
        this.http.post<Song>(this.ignoreUrl, this.httpOptionsCred)
            .pipe(tap(_ => {
              this._addSong(sap);
            })));
  }

  _addSong(sap: SongAtPlaylist): void {
    firstValueFrom(this.getPlaylists().pipe(tap((playlists: Playlist[]) => {
      console.log(sap);
      const index: number = playlists.findIndex(x => x.id === sap.playlist.id);
      playlists[index].songs.push(sap.song);
    })));
  }

  searchGenius(query: string): Observable<GeniusResponse> {
    const geniusHttpOptions = {
      // TODO: play with headers
      // headers: new HttpHeaders({
      //  'Authorization': 'Bearer ' + this.accessToken
      //}),
      params: {q: query, access_token: this.accessToken}
    };
    const url = 'https://api.genius.com/search';
    return this.http.get<GeniusResponse>(url, geniusHttpOptions)
        .pipe(map(res => {
          console.log(res);
          return res;
        }));
  }


  showSong(song: JSON): void {
    // TODO: Make an HTTP request for a specific song
    this.songSubject.next(song);
    // this.searchGeniusSong(song['id']).pipe(tap((value: JSON) => {
    //  this.songSubject.next(value);
    //}));
  }

  searchGeniusSong(id: number): Observable<JSON> {
    const geniusHttpOptions = {params: {access_token: this.accessToken}};
    const url = 'https://api.genius.com/songs/' + id;
    return this.http.get<GeniusResponse>(url, geniusHttpOptions)
        .pipe(map((res: GeniusResponse) => {
          console.log(res);
          return res.response.hits[0].result;
        }));
  }
}
