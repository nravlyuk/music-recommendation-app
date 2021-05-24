import { TestBed } from '@angular/core/testing';

import { SongPageService } from './song-page.service';

describe('SongPageService', () => {
  let service: SongPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
