import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })

@Pipe({
    name: 'dateFormat'
  })
export class Formatfecha  extends DatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        ///MMM/dd/yyyy 
        return super.transform(value, "MM/dd/yyyy  h:mm:ss");
    }
}
