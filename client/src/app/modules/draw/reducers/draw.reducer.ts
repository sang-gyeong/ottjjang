import {Action, createFeatureSelector, createReducer, createSelector} from '@ngrx/store';
import {filter, find, findIndex, forEach, map, pick, set} from 'lodash';
import {mutableOn} from 'ngrx-etc';
import * as drawActions from '../actions/draw.action';

export interface State {
  clothesList: {id: number; key: string; isSelected: boolean}[];
}

export const initialState: State = {
  clothesList: [],
};

const drawReducer = createReducer(
  initialState,
  mutableOn(drawActions.loadDrawContentsComplete, (state: State, {res}) => {
    state.clothesList = map(res, r => ({key: r?.key ?? '', isSelected: !!r.isSelected, id: r.id}));
  }),
  mutableOn(drawActions.deleteClothesItemComplete, (state: State, {id}) => {
    state.clothesList = filter(state.clothesList, clothes => clothes.id !== id);
  }),
  mutableOn(drawActions.saveClothesItemComplete, (state: State, {id, key}) => {
    state.clothesList = [...state.clothesList, {id, key, isSelected: true}];
  }),
  mutableOn(drawActions.toggleSelectedClothes, (state: State, {key}) => {
    const target = find(state.clothesList, ['key', key]);

    if (target) {
      target.isSelected = !target.isSelected;
    }
  })
);

export const selectDraw = createFeatureSelector<State>('draw');
export const selectClothesList = createSelector(selectDraw, state => state.clothesList);

export function reducer(state = initialState, action: Action): State {
  return drawReducer(state, action);
}
