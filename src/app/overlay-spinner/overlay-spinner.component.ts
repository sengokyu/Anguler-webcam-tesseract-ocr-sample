import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { OverlaySpinnerService } from './overlay-spinner.service';

@Component({
  selector: 'overlay-spinner',
  imports: [AsyncPipe, MatProgressSpinnerModule],
  template: `@if (show$ | async) {
    <div class="spinner-container">
      <mat-spinner></mat-spinner>
    </div>
  } `,
  styles: `
    .spinner-container {
      z-index: 1200;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      display: flex;
      justify-content: center;
      align-items: center;

      background-color: rgba(64, 64, 64, 0.7);
    }
  `,
})
export class OverlaySpinnerComponent {
  readonly show$: Observable<boolean>;

  constructor(overlaySpinnerService: OverlaySpinnerService) {
    this.show$ = overlaySpinnerService.show$;
  }
}
