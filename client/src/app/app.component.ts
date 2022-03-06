import {DOCUMENT} from '@angular/common';
import {Component, Inject, Renderer2} from '@angular/core';
import * as agent from '../util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ottjjang';

  constructor(@Inject(DOCUMENT) private document: Document, private renderer2: Renderer2) {
    if (agent.isDesktop()) {
      this.documentElementAddClass('pc');
    }
  }

  private documentElementAddClass(className: string): void {
    this.renderer2.addClass(this.document.documentElement, className);
  }
}
