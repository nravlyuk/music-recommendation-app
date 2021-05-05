import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExampleComponent} from './example/example.component';
import {IgnoredComponent} from './ignored/ignored.component'
import {PlaylistsComponent} from './playlists/playlists.component'

const routes: Routes = [
  {path: 'example/', component: ExampleComponent},
  {path: 'playlists', component: PlaylistsComponent},
  {path: 'ignored', component: IgnoredComponent},
  {path: '**', redirectTo: 'playlists/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
