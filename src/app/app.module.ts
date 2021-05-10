import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ExampleComponent } from './example/example.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { IgnoredComponent } from './ignored/ignored.component';
import { RecommendedComponent } from './recommended/recommended.component';
import { GeniusSearchComponent } from './genius-search/genius-search.component';

@NgModule({
  declarations: [AppComponent, ExampleComponent, PlaylistsComponent, IgnoredComponent, RecommendedComponent, GeniusSearchComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
