import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

export interface MessageDialogData {
  title: string;
  message: string | null;
}

@Component({
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.css',
})
export class MessageDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {}
}
