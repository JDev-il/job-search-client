import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'stringSanitizer',
  standalone: true
})
export class StringSanitizerPipe implements PipeTransform {

  svgSanitize(path: string): SafeResourceUrl {
    const sanitizer = inject(DomSanitizer);
    return sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  transform(value: string): string {
    let sanitizedString = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[`_]/g, '')
      .trim()
      .normalize('NFC');
    return sanitizedString;
  }

}
