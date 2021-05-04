import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExampleComponent} from './example/example.component';
import {PlaylistsComponent} from './playlists/playlists.component'

const routes: Routes = [
  {path: 'example/', component: ExampleComponent},
  {path: 'playlists/', component: PlaylistsComponent},
  {path: '**', redirectTo: 'playlists/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
