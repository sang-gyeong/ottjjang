import {Action, createFeatureSelector, createReducer, createSelector} from '@ngrx/store';
import {mutableOn} from 'ngrx-etc';
import * as mainActions from '../actions/main.action';

export interface State {
  user?: {
    id: number;
    nickname: string;
    profileURL: string;
  };
}

const initialState: State = {
  user: {
    id: 0,
    nickname: '',
    profileURL: '',
  },
};

const mainReducer = createReducer(
  initialState,
  mutableOn(mainActions.loadMainDataComplete, (state: State, {res}) => {
    console.log(res.data[0].user);
    state.user = res.data[0].user;
  })
);

export const selectMain = createFeatureSelector<State>('main');
export const selectUser = createSelector(selectMain, state => state.user);

export function reducer(state = initialState, action: Action): State {
  return mainReducer(state, action);
}
