import { Injectable, OnDestroy } from '@angular/core';
import { from, map, Observable, of, Subject, tap } from 'rxjs';
import * as tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root',
})
export class TesseractService implements OnDestroy {
  private worker: tesseract.Worker | undefined;
  private readonly initState = new Subject<void>();

  constructor() {}

  init(): Observable<void> {
    if (this.initState.closed) {
      return of();
    }

    from(this._init()).subscribe(() => {
      console.log('Tesseract initialized.');
      this.initState.complete();
    });

    return this.initState.asObservable();
  }

  recognize(image: tesseract.ImageLike): Observable<string | null> {
    const promise = this.worker?.recognize(image);

    if (!promise) {
      return of(null);
    }

    return from(promise).pipe(
      tap((result) => {
        console.log(result.data);
      }),
      map((result) => result.data.text),
    );
  }

  ngOnDestroy(): void {
    if (this.worker) {
      this.worker.terminate().then(() => {
        console.log('Tesseract worker terminated.');
      });
    }
  }

  private async _init(): Promise<void> {
    this.worker = await tesseract.createWorker('jpn');
  }
}
