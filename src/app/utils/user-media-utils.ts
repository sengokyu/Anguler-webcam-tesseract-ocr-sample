/**
 * UserMedia API utils
 */
import { from, map, Observable, throwError } from 'rxjs';

export const enumerateVideoInputDevices = (): Observable<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return throwError(
      () => new Error('mediaDevices.enumerateDevices is not supported'),
    );
  }

  return from(navigator.mediaDevices.enumerateDevices()).pipe(
    map((devices) => devices.filter((x) => x.kind == 'videoinput')),
  );
};

export const getUserMedia = (
  device: MediaDeviceInfo,
): Observable<MediaStream> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return throwError(
      () => new Error('mediaDevices.getUserMedia is not supported'),
    );
  }

  const constrains = {
    exact: device.deviceId,
    video: true,
  } as MediaStreamConstraints;

  return from(navigator.mediaDevices.getUserMedia(constrains));
};
