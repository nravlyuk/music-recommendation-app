import {Song} from './song';

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  songs: Song[];
}
