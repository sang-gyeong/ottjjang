import {Component, OnInit} from '@angular/core';
import {createSelector, Store} from '@ngrx/store';
import {selectUser} from 'src/app/reducers/main.reducer';
import * as fromMain from '../../../reducers/main.reducer';

const selectVM = createSelector(selectUser, user => {
  if (!user) {
    return null;
  }

  return {
    nickname: user.nickname,
    profileURL: user.profileURL,
  };
});

@Component({
  selector: 'app-pc-header',
  templateUrl: './pc-header.component.html',
  styleUrls: ['./pc-header.component.css'],
})
export class PcHeaderComponent implements OnInit {
  vm$ = this.store$.select(selectVM);

  constructor(private store$: Store<fromMain.State>) {}

  ngOnInit(): void {}
}