import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[ideNginit]'
})
export class NginitDirective {

  @Input() values: any;

  @Input() ngInit: any;

  constructor() { }

  ngOnInit() {
    if(this.ngInit) { this.ngInit(); }
  } 

}
