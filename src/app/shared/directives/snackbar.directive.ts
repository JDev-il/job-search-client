import { Directive, ElementRef, Input, OnInit, Renderer2, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersMessages } from '../../core/models/enum/messages.enum';

@Directive({
  selector: '[SnackBar]',
  exportAs: 'SnackBar',
  standalone: true
})
export class SnackBarDirective implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private _router = inject(Router);


  @Input() durationInSeconds: number = 5;
  @Input() snackBarMessage: string = '';
  @Input() actionLabel: string = 'Dismiss';
  @Input() customClass: string = ''; // Class for custom styling

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  public openSnackBar(text: UsersMessages) {
    this.snackBarMessage = text;
    if (this.snackBarMessage) {
      const snackBarRef: MatSnackBarRef<any> = this._snackBar.open(
        this.snackBarMessage,
        this.actionLabel,
        {
          horizontalPosition: 'center',
          panelClass: this.customClass ? [this.customClass] : []
        },
      );

      snackBarRef.onAction().subscribe(() => {
        if (UsersMessages.exists === text) {
          this._router.navigate(['']);
        } else {
          this._router.navigate(['register']);
        }
      });
    }
  }

  ngOnInit(): void {
    // this.renderer.setStyle('mdc-snackbar mat-mdc-snack-bar-container');
  }
}
