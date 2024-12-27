import { ApplicationRef, Component, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {


  constructor(private appRef: ApplicationRef, private ngZone: NgZone) {
    // this.appRef.isStable.subscribe(stable => {
    //   console.log('Is app stable:', stable);
    // });
    // this.ngZone.onUnstable.subscribe(() => console.log('Zone became unstable'));
    // this.ngZone.onStable.subscribe(() => console.log('Zone became stable'));
  }

  //! RESOLVE WARNING: app stability

  title = 'client';
}
