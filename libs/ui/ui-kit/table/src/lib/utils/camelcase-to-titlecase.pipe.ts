import { Pipe, PipeTransform } from '@angular/core';
import { StringHelpers } from '@spider-baby/utils-common/strings';

@Pipe({
  name: 'camelToTitle',
})
export class CamelToTitlePipe implements PipeTransform {

  transform(value: string): unknown {
    if (!value) 
      return '';

    if (typeof value !== 'string') 
      return value;

    return StringHelpers.toTitleCase(value);
  }

}
