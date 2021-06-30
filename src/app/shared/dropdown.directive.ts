import {Directive, ElementRef, HostBinding, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.show') isOpen = false;
  constructor( private renderer: Renderer2) { }

  @HostListener('click') click(event: Event): void{
    this.isOpen = !this.isOpen;
  }
}
