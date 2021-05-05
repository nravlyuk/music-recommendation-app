import {Playlist} from './playlist';
import {Song} from './song';

export interface SessionRequest {
  playlists: Playlist[];
  ignored: Song[];
}

export interface SongAtPlaylist {
  playlist: Playlist;
  song: Song;
}
