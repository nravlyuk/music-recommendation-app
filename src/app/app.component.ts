import {Component} from '@angular/core';
import {Chart} from 'chart.js';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import {catchError, first, shareReplay, tap} from 'rxjs/operators';


import {SongPageService} from './song-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';
  opened: boolean;
  sidenavOpened$: Observable<boolean> = this.songPageService.getPageState();
  constructor(private songPageService: SongPageService) {
    this.sidenavOpened$.subscribe((opened: boolean) => this.opened = opened);
  }
}
