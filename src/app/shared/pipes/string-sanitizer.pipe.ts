import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringSanitizer',
  standalone: true
})
export class StringSanitizerPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    let sanitizedString = value.replace(/`/g, '').normalize('NFC');
    return sanitizedString;
  }

}
