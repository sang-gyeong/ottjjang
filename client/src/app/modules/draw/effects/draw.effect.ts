import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import * as drawActions from '../actions/draw.action';
import * as fromRoot from '../../../reducers/main.reducer';
import * as mainActions from '../../../actions/main.action';
import {MAX_KEYS} from '../consts';
import {DrawService} from '../services/draw.service';
import {State, Store} from '@ngrx/store';

@Injectable()
export class DrawEffect {
  constructor(private actions$: Actions, private drawService: DrawService, private store$: Store<fromRoot.State>) {}

  loadDrawContents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(drawActions.loadDrawContents),
      withLatestFrom(this.store$.select(fromRoot.selectUserKakaoId)),
      switchMap(([, kakaoId]) => {
        const params: AWS.S3.ListObjectsV2Request = {
          Bucket: environment.bucket_name,
          MaxKeys: MAX_KEYS,
          Prefix: `${kakaoId}`,
        };

        return this.drawService.loadDrawContents(params).pipe(
          map(({data}) => drawActions.loadDrawContentsComplete({res: data})),
          catchError(err => {
            this.setError(err);

            return EMPTY;
          })
        );
      })
    );
  });

  deleteClothesItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(drawActions.deleteClothesItem),
      switchMap(({key, id}) => {
        return this.drawService.deleteClothesItem(key, id).pipe(
          map(id => drawActions.deleteClothesItemComplete({id})),
          catchError(err => {
            this.setError(err);

            return EMPTY;
          })
        );
      })
    );
  });

  saveClothesItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(drawActions.saveClothesItem),
      withLatestFrom(this.store$.select(fromRoot.selectUserKakaoId)),
      switchMap(([{blobData}, kakaoId]) => {
        const fileName = `${kakaoId}/${Date.now()}.png`;
        return this.drawService.saveClothesItem(fileName, blobData).pipe(
          map(({id, key}) => {
            const canvas = document.querySelector('canvas');
            const context = canvas?.getContext('2d');

            if (canvas && context) {
              context.clearRect(0, 0, canvas.width, canvas.height);
            }

            return drawActions.saveClothesItemComplete({id, key});
          }),
          catchError(err => {
            this.setError(err);

            return EMPTY;
          })
        );
      })
    );
  });

  saveStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(drawActions.saveStatus),
      switchMap(({data}) => {
        return this.drawService.saveStatus(data).pipe(
          map(() => drawActions.saveStatusComplete()),
          catchError(err => {
            this.setError(err);

            return EMPTY;
          })
        );
      })
    );
  });

  private setError(err: Error) {
    alert(err);
  }
}
