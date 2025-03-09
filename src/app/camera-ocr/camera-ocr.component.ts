import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  enumerateVideoInputDevices,
  getUserMedia,
} from '../utils/user-media-utils';

// 停止ボタンの表示
type StopType = 'stop' | undefined;

@Component({
  selector: 'camera-ocr',
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  templateUrl: './camera-ocr.component.html',
  styleUrl: './camera-ocr.component.scss',
})
export class CameraOcrComponent implements OnInit, AfterViewInit, OnDestroy {
  devices$: Observable<MediaDeviceInfo[]> | undefined;
  readonly deviceFc = new FormControl<MediaDeviceInfo | null>(null);
  readonly hideCanvas = signal<boolean>(true);
  readonly playStop$ = new BehaviorSubject<StopType>(undefined);

  @ViewChild('video', { static: true })
  private videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true })
  private canvasElement!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnInit(): void {
    this.devices$ = enumerateVideoInputDevices();
    this.deviceFc.valueChanges.subscribe((device) => {
      this.onChangeDeviceFc(device);
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // ビデオを停止
    this.stopTracks();
  }

  onClick(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    context?.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    this.hideCanvas.set(false);
  }

  onClickClose(): void {
    this.hideCanvas.set(true);
  }

  onClickPlayStop(): void {
    if (!this.stream) {
      return;
    }

    this.stopTracks();
  }

  private get video(): HTMLVideoElement {
    return this.videoElement.nativeElement;
  }

  private get stream(): MediaStream | null | undefined {
    return this.video.srcObject as MediaStream;
  }

  private stopTracks(): void {
    this.deviceFc.setValue(null, { emitEvent: false });
    this.stream?.getVideoTracks().forEach((track) => track.stop());
  }

  private onChangeDeviceFc(value: MediaDeviceInfo | null): void {
    if (value) {
      getUserMedia(value).subscribe((stream) => {
        this.video.srcObject = stream;
        this.video.play();
        this.playStop$.next('stop');
      });
    }
  }
}
