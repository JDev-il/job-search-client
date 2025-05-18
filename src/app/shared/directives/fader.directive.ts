import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
@Directive({
  selector: '[fader]',
  standalone: true
})
export class FaderDirective {
  @Input() el!: ElementRef;
  constructor(private ref: ElementRef, private renderer: Renderer2) {
    this.el = this.ref.nativeElement;
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el, "fadein-opacity");
  }
}
