import {Action, createFeatureSelector, createReducer, createSelector} from '@ngrx/store';
import {mutableOn} from 'ngrx-etc';
import * as mainActions from '../actions/main.action';

export interface State {
  user?: {
    id: number;
    kakaoId: number;
    nickname: string;
    profileURL: string;
  };
}

export const initialState: State = {
  user: {
    id: 0,
    kakaoId: NaN,
    nickname: '',
    profileURL: '',
  },
};

const mainReducer = createReducer(
  initialState,
  mutableOn(mainActions.loadMainDataComplete, (state: State, {res}) => {
    if (res.data) {
      state.user = res?.data[0]?.user;
    }
  })
);

export const selectMain = createFeatureSelector<State>('main');
export const selectUser = createSelector(selectMain, state => state.user);
export const selectUserKakaoId = createSelector(selectMain, state => state.user?.kakaoId ?? NaN);

export function reducer(state = initialState, action: Action): State {
  return mainReducer(state, action);
}
