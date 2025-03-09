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
import { BehaviorSubject, Observable } from 'rxjs';
import { OverlaySpinnerService } from '../overlay-spinner/overlay-spinner.service';
import { TesseractService } from '../tesseract.service';
import {
  enumerateVideoInputDevices,
  getUserMedia,
} from '../utils/user-media-utils';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

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

  constructor(
    private overlaySpinnerService: OverlaySpinnerService,
    private tesseractService: TesseractService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.overlaySpinnerService.show();
    this.tesseractService.init().subscribe(() => {});

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
    this.showCanvas();

    this.tesseractService
      .recognize(this.canvasElement.nativeElement)
      .subscribe((text) => {
        this.showResult(text);
      });
  }

  onClickStop(): void {
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
    this.playStop$.next(undefined);
  }

  private onChangeDeviceFc(value: MediaDeviceInfo | null): void {
    if (value) {
      getUserMedia(value, 'environment').subscribe((stream) => {
        const settings = stream.getVideoTracks()[0].getSettings();

        this.resizeCanvas(settings.width!, settings.height!);

        this.video.srcObject = stream;

        this.playStop$.next('stop');
      });
    }
  }

  private showCanvas(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    context?.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
    );

    this.hideCanvas.set(false);
  }

  private showResult(text: string | null) {
    this.dialog
      .open(MessageDialogComponent, {
        data: {
          title: '読み取り結果結果',
          message: text,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.hideCanvas.set(true);
      });
  }

  private resizeCanvas(width: number, height: number) {
    const canvas = this.canvasElement.nativeElement;

    // ビデオの解像度と同じにする
    canvas.width = width;
    canvas.height = height;
  }
}
