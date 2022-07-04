import {Action, createFeatureSelector, createReducer, createSelector} from '@ngrx/store';
import {mutableOn} from 'ngrx-etc';
import * as mainActions from '../actions/main.action';
import {set} from 'lodash';

export interface State {
  user?: {
    id: number;
    kakaoId: number;
    nickname: string;
    profileURL: string;
  };
  feedList?: {
    createdAt: string;
    createdBy: string;
    imgUrl: string;
    likeCounts: number;
    title: string;
    content: string;
  }[];
}

export const initialState: State = {
  user: {
    id: 0,
    kakaoId: NaN,
    nickname: '',
    profileURL: '',
  },
  feedList: [],
};

const mainReducer = createReducer(
  initialState,
  mutableOn(mainActions.loadMainDataComplete, (state: State, {res}) => {
    if (res.data) {
      state.user = res?.data[0]?.user;
      set(state, ['feedList'], res?.feedList);
    }
  })
);

export const selectMain = createFeatureSelector<State>('main');
export const selectUser = createSelector(selectMain, state => state.user);
export const selectUserKakaoId = createSelector(selectMain, state => state.user?.kakaoId ?? NaN);
export const selectFeedList = createSelector(selectMain, state => state.feedList);

export function reducer(state = initialState, action: Action): State {
  return mainReducer(state, action);
}
