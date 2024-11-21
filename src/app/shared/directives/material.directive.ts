import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[custom-mat-form]',
  standalone: true,
})
export class MaterialDirective implements OnInit {
  form!: ElementRef<HTMLFormElement>;
  formField!: HTMLFormElement[];

  constructor(private readonly el: ElementRef, private renderer: Renderer2) {
    this.form = this.el.nativeElement;
  }

  ngOnInit(): void {
    const button = this.el.nativeElement.querySelector(".mdc-button");
    //Button
    this.renderer.setStyle(button, 'margin', '15px auto 0');
    this.renderer.setStyle(button, 'width', '50%');

  }
}
