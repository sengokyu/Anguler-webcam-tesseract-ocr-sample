import { Component } from '@angular/core';
import { CameraOcrComponent } from './camera-ocr/camera-ocr.component';
import { OverlaySpinnerComponent } from './overlay-spinner/overlay-spinner.component';

@Component({
  selector: 'app-root',
  imports: [CameraOcrComponent, OverlaySpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
