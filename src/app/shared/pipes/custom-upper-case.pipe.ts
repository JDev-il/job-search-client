import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstToUpperCase',
  standalone: true
})
export class FirstToUpperCasePipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return '';
    let str: string;
    str = value[0].toUpperCase() + value.slice(1);
    return str;
  }
}
