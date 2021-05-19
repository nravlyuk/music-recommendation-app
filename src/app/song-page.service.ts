import {Injectable} from '@angular/core';
import {firstValueFrom, Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SongPageService {
  pageVisible = new Subject<boolean>();
  visible$ = this.pageVisible.asObservable();
  constructor() {}

  getPageState(): Observable<boolean> {
    return this.visible$;
  }

  openPageEvent(): void {
    this.pageVisible.next(true);
  }
  closePageEvent(): void {
    this.pageVisible.next(false);
  }
}
