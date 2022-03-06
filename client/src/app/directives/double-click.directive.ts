import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[cuDoubleClick]',
})
export class DoubleClickDirective {
  @Input()
  delay = 300;

  @Output('cuDoubleClick')
  doubleClick = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick(): void {
    const now = Date.now();

    if (now - this.lastTap < this.delay) {
      this.doubleClick.emit();
    } else {
      this.lastTap = now;
    }
  }

  lastTap = Date.now();
}
