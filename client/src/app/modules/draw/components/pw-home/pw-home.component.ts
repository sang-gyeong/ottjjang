import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import * as AWS from 'aws-sdk';
import {environment} from 'src/environments/environment';
import {BackgroundColors} from '../../consts';
import * as fromRoot from '../../../../reducers/main.reducer';
import {Store} from '@ngrx/store';

const MAX_KEYS = 300;
const OBJECT_STORE_HEADER = 'https://summber-obj.kr.object.ncloudstorage.com/';
const END_POINT = 'https://kr.object.ncloudstorage.com';
@Component({
  selector: 'app-pw-home',
  templateUrl: './pw-home.component.html',
  styleUrls: ['./pw-home.component.css'],
})
export class PwHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  canvas?: ElementRef<HTMLCanvasElement>;

  painting$ = new BehaviorSubject<boolean>(false);
  filling$ = new BehaviorSubject<boolean>(false);

  context?: CanvasRenderingContext2D | null;
  x = 0;
  y = 0;
  currentKey = '';
  header = OBJECT_STORE_HEADER;
  contents: any[] = [];

  private kakaoId = NaN;
  private selectUserKakaoId$ = this.store$.select(fromRoot.selectUser).pipe(map(user => user?.kakaoId ?? NaN));

  readonly backgroundColors = BackgroundColors;
  readonly bucket = new AWS.S3({
    endpoint: new AWS.Endpoint(END_POINT),
    region: environment.region,
    credentials: {
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
    },
  });

  constructor(private store$: Store<fromRoot.State>) {
    this.selectUserKakaoId$.subscribe(kakaoId => (this.kakaoId = kakaoId));
  }

  ngOnInit() {
    this.getDatas();
  }

  ngAfterViewInit() {
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');
    if (!this.context) {
      return;
    }
    this.context.lineWidth = 2.5;
    this.context.fillStyle = 'transparent';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.strokeStyle = '#000000'; // black
    this.canvas.nativeElement.addEventListener('mousemove', this.onMouseMove, false);
  }

  onMouseMove = (event: MouseEvent): void => {
    if (!this.context) {
      return;
    }
    this.x = event.offsetX;
    this.y = event.offsetY;
    if (!this.filling$.value) {
      if (!this.painting$.value) {
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
      } else {
        this.context.lineTo(this.x, this.y);
        this.context.stroke();
      }
    }
  };

  onRangeChange = (event: Event): void => {
    if (!this.context) {
      return;
    }
    const value = (event.target as HTMLInputElement).value;
    this.context.lineWidth = parseInt(value);
  };

  onColorClick = (event: Event): void => {
    if (!this.context) {
      return;
    }
    const style = (event.target as HTMLElement).style;
    this.context.strokeStyle = style.backgroundColor;
  };

  onCanvasClear = () => {
    if (!this.context || !this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  };

  onCanvasClick = () => {
    if (!this.filling$.value || !this.context || !this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    this.context.closePath();
    this.context.beginPath();
    this.context.fillStyle = this.context.strokeStyle;
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  };

  saveImage = () => {
    this.uploadCanvasToServer();
  };

  startPainting = () => {
    this.painting$.next(true);
  };

  stopPainting = () => {
    this.painting$.next(false);
  };

  startFilling = () => {
    this.filling$.next(true);
  };

  stopFilling = () => {
    this.filling$.next(false);
  };

  uploadCanvasToServer() {
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const blobData = this.dataURItoBlob(dataUrl);
    const fileName = `${this.kakaoId}/${Math.random() * 100}.png`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: environment.bucket_name,
      Key: fileName,
      Body: blobData,
      ACL: 'public-read',
      ContentType: 'image/png',
    };

    this.bucket.upload(params, {}, (err, data) => {
      const message = err ? 'ERROR!' : 'UPLOADED';
      alert(message);
      this.getDatas();
    });
  }

  dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }

  getDatas() {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: environment.bucket_name,
      MaxKeys: MAX_KEYS,
      Prefix: `${this.kakaoId}`,
    };

    const listAllKeys = (params: AWS.S3.ListObjectsV2Request, out = []) =>
      new Promise((resolve, reject) => {
        this.bucket
          .listObjectsV2(params)
          .promise()
          .then(({Contents, IsTruncated, NextContinuationToken}) => {
            this.contents = Contents as any;
            !IsTruncated
              ? resolve(out)
              : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
          })
          .catch(reject);
      });

    listAllKeys(params);
  }
}
