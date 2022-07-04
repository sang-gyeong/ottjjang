import {createAction, props} from '@ngrx/store';

export const loadMainData = createAction('[MAIN] Load Main Data');
export const loadMainDataComplete = createAction(
  '[MAIN] Load Main Data Complete',
  props<{res: {data: any; feedList: any}}>()
);
