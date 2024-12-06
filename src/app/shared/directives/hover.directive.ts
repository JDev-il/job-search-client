import { Directive, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonTextsEnum } from '../../core/models/enum/utils.interface';
import { StateService } from '../services/state.service';

@Directive({
  selector: '[appHover]',
  standalone: true
})

export class HoverDirective implements OnInit {
  constructor(private stateService: StateService, private router: Router) {
  }
  ngOnInit(): void {
    this.unSetText();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.setText()
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.unSetText();
  }


  private get isLogin(): boolean {
    return this.router.url.startsWith('/login');
  }

  private setText(): void {
    this.stateService.setHoverText = this.isLogin ? ButtonTextsEnum.loginhover : ButtonTextsEnum.registerhover;
  }

  private unSetText(): void {
    this.stateService.setHoverText = this.isLogin ? ButtonTextsEnum.loginunhover : ButtonTextsEnum.registerunhover;
  }

}
