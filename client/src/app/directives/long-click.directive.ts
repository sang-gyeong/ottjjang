import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {fromEvent, map, merge, Subscription, tap} from 'rxjs';

@Directive({
  selector: '[cuLongClick]',
})
export class LongClickDirective {
  @Input()
  delay = 2500;

  @Output('cuLongClick')
  longClick = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick($event: Event): void {
    this.start = Date.now();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(): void {
    const now = Date.now();

    if (now - this.start > this.delay) {
      this.longClick.emit();
    }
    this.start = now;
  }

  start = Date.now();
}
