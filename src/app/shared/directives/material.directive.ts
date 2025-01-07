import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[custom-mat-form]',
  standalone: true,
})
export class MaterialDirective {
  form!: ElementRef<HTMLFormElement>;
  formField!: HTMLFormElement[];

  constructor(private readonly el: ElementRef, private renderer: Renderer2) {
    this.form = this.el.nativeElement;
  }

}
