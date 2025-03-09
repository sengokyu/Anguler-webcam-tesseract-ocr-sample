import { Component } from '@angular/core';
import { CameraOcrComponent } from './camera-ocr/camera-ocr.component';

@Component({
  selector: 'app-root',
  imports: [CameraOcrComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
