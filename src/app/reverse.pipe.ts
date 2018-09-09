import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: Array<any>, args?: any): any {
    if(value != null){
     return value.slice().reverse();
    }
    return null;
  }

}
