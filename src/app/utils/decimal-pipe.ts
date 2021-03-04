import { Pipe, PipeTransform} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })

@Pipe({
    name: 'decimalFormat'
  })
export class DecimalFormat extends DecimalPipe implements PipeTransform{

    transform(value: any, args?: any): any {
        
        return super.transform(value, '1.2-2');

        
    }

    
}
