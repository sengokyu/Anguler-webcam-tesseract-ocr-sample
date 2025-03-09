import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OverlaySpinnerService {
  private readonly _stack: Array<any> = [];
  private readonly _show = new Subject<boolean>();

  public get show$(): Observable<boolean> {
    return this._show.asObservable();
  }

  public show(): void {
    this._stack.push(1);
    this._show.next(true);
  }

  public close(): void {
    this._stack.pop();
    if (this._stack.length == 0) {
      this._show.next(false);
    }
  }
}
