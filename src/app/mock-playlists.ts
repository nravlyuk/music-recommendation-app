import {Playlist} from './interfaces/playlist';
import {Song} from './interfaces/song';

export const PLAYLISTS: Playlist[] = [
  {
    id: 11,
    name: 'Playlist1',
    songs: [
      {id: 1, title: 'Song 1'}, {id: 2, title: 'Song 2'},
      {id: 3, title: 'Song 3'}
    ]
  },
  {
    id: 12,
    name: 'Playlist2',
    songs: [
      {id: 1, title: 'Song 1'}, {id: 2, title: 'Song 2'},
      {id: 3, title: 'Song 3'}
    ]
  },
  {
    id: 13,
    name: 'Playlist3',
    songs: [
      {id: 1, title: 'Song 1'}, {id: 2, title: 'Song 2'},
      {id: 3, title: 'Song 3'}
    ]
  },
];
