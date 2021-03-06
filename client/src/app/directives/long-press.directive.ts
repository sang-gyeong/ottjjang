import {Directive, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[longPress]',
})
export class LongPressDirective {
  private touchTimeout: any;
  @Output() longPress = new EventEmitter();

  constructor() {}

  @HostListener('touchstart') touchstart(): void {
    this.touchTimeout = setTimeout(() => {
      this.longPress.emit();
    }, 2000);
  }

  @HostListener('mousedown') mousedown(): void {
    this.touchTimeout = setTimeout(() => {
      this.longPress.emit();
    }, 2000);
  }

  @HostListener('touchend') touchend(): void {
    this.touchEnd();
  }

  @HostListener('mouseup') mouseup(): void {
    this.touchEnd();
  }

  @HostListener('touchcancel') touchcancel(): void {
    this.touchEnd();
  }

  private touchEnd(): void {
    clearTimeout(this.touchTimeout);
  }
}
