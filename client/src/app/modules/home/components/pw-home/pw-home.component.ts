import {Component, OnInit} from '@angular/core';
import {createSelector, Store} from '@ngrx/store';
import * as mainReducer from '../../../../reducers/main.reducer';

@Component({
  selector: 'app-pw-home',
  templateUrl: './pw-home.component.html',
  styleUrls: ['./pw-home.component.css'],
})
export class PwHomeComponent implements OnInit {
  private static selectViewModel = createSelector(mainReducer.selectFeedList, feedList => {
    return {
      feedList,
    };
  });

  viewModel$ = this.store$.select(PwHomeComponent.selectViewModel);

  constructor(private store$: Store<mainReducer.State>) {}

  ngOnInit(): any {}
}
