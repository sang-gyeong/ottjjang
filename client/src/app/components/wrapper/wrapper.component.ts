import {Component, OnInit} from '@angular/core';
import * as agent from 'src/util';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css'],
})
export class WrapperComponent implements OnInit {
  readonly isDesktop = agent.isDesktop();

  constructor() {}

  ngOnInit(): void {}
}
