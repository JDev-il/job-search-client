import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringSanitizer',
  standalone: true
})
export class StringSanitizerPipe implements PipeTransform {

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
