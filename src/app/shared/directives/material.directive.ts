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
    this.formField = this.el.nativeElement.querySelectorAll(".mat-mdc-form-field");
  }

  ngOnInit(): void {
    const button = this.el.nativeElement.querySelector(".mdc-button");
    //Form
    this.renderer.setStyle(this.form, 'display', 'flex');
    this.renderer.setStyle(this.form, 'flex-flow', 'column');
    this.renderer.setStyle(this.form, 'padding', '10px 15px 10px');
    if (this.formField.length > 0) {
      this.formField.forEach(formField => {
        this.renderer.setStyle(formField, 'margin', '10px 10px 0px');
      })
    }
    //Button
    this.renderer.setStyle(button, 'margin', '15px auto 0');
    this.renderer.setStyle(button, 'width', '50%');

  }
}
