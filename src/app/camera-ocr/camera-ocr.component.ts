import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { from, map, Observable, throwError } from 'rxjs';
import {
  enumerateVideoInputDevices,
  getUserMedia,
} from '../utils/user-media-utils';

@Component({
  selector: 'camera-ocr',
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './camera-ocr.component.html',
  styleUrl: './camera-ocr.component.scss',
})
export class CameraOcrComponent implements OnInit, AfterViewInit {
  devices$: Observable<MediaDeviceInfo[]> | undefined;
  readonly deviceFc = new FormControl<MediaDeviceInfo | null>(null);

  @ViewChild('video', { static: true })
  private videoElement!: ElementRef<HTMLVideoElement>;

  constructor() {}

  ngOnInit(): void {
    this.devices$ = enumerateVideoInputDevices();
    this.deviceFc.valueChanges.subscribe((device) => {
      this.onDeviceFcChange(device);
    });
  }

  ngAfterViewInit(): void {}

  private onDeviceFcChange(value: MediaDeviceInfo | null): void {
    if (value) {
      getUserMedia(value).subscribe((stream) => {
        const video = this.videoElement.nativeElement;

        video.srcObject = stream;
        video.play();
      });
    }
  }
}
