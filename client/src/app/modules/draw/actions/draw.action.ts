import {createAction, props} from '@ngrx/store';

export const loadDrawContents = createAction('[DRAW] Load Draw Contents');
export const loadDrawContentsComplete = createAction('[Draw] Load Draw Contents Complete', props<{res: any}>());

export const deleteClothesItem = createAction('[Draw] Delete Clothes Item', props<{id: number, key: string}>());
export const deleteClothesItemComplete = createAction('[Draw] Delete Clothes Item Complete', props<{id: number}>());

export const saveClothesItem = createAction('[Draw] Save Clothes Item', props<{blobData: Blob}>());
export const saveClothesItemComplete = createAction(
  '[Draw] Save Clothes Item Complete',
  props<{id: number; key: string}>()
);

export const saveStatus = createAction('[DRAW] Save Status', props<{data: {key: string; isSelected: boolean}[]}>());
export const saveStatusComplete = createAction('[DRAW] Save Status Complete');

export const toggleSelectedClothes = createAction('[DRAW] Toggle Selected Clothes', props<{key: string}>());
