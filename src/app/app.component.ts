import { Component } from '@angular/core';
import { CameraOcrComponent } from './camera-ocr/camera-ocr.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, CameraOcrComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
