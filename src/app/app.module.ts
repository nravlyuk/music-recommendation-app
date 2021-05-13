import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ExampleComponent} from './example/example.component';
import {GeniusSearchComponent} from './genius-search/genius-search.component';
import {IgnoredComponent} from './ignored/ignored.component';
import {MaterialModule} from './material/material.module';
import {PlaylistsComponent} from './playlists/playlists.component';
import {RecommendedComponent} from './recommended/recommended.component';
import {SongPageComponent} from './song-page/song-page.component';
import { AddPlaylistComponent } from './add-playlist/add-playlist.component';

@NgModule({
  declarations: [
    AppComponent, ExampleComponent, PlaylistsComponent, IgnoredComponent,
    RecommendedComponent, GeniusSearchComponent, SongPageComponent, AddPlaylistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'fill'},
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
