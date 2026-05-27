import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Directive, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonsEnum } from '../../core/models/enum/utils.enum';
import { DataService } from '../services/data.service';

@Directive({
  selector: '[appHover]',
  standalone: true
})

export class HoverDirective implements OnInit {
  constructor(private dataService: DataService, private router: Router, private breakPointServer: BreakpointObserver) {
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

  private get isMobile(): boolean {
    return this.breakPointServer.isMatched(Breakpoints.Small)
  }

  private setText(): void {
    this.dataService.setHoverText(
      this.isLogin && !this.isMobile ? ButtonsEnum.loginhover : ButtonsEnum.registerhover
    );
  }

  private unSetText(): void {
    this.dataService.setHoverText(
      this.isLogin && !this.isMobile ? ButtonsEnum.loginunhover : ButtonsEnum.registerunhover
    );
  }
}
