import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import * as AWS from 'aws-sdk';
import {environment} from 'src/environments/environment';
import {BackgroundColors} from '../../consts';
import * as fromRoot from '../../../../reducers/main.reducer';
import {Store} from '@ngrx/store';
import {forEach} from 'lodash';

const MAX_KEYS = 300;
const OBJECT_STORE_HEADER = 'https://summber-obj.kr.object.ncloudstorage.com/';
const END_POINT = 'https://kr.object.ncloudstorage.com';
@Component({
  selector: 'app-pw-home',
  templateUrl: './pw-home.component.html',
  styleUrls: ['./pw-home.component.css'],
})
export class PwHomeComponent implements OnInit, AfterViewInit {
  @HostListener('mousemove', ['$event'])
  mouseMoveEvent(event: MouseEvent & TouchEvent): void {
    const targetEl = event.target as HTMLElement;

    if (targetEl.nodeName !== 'CANVAS') {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.onMouseMove(event);
  }

  @HostListener('touchmove', ['$event'])
  touchMoveEvent(event: MouseEvent & TouchEvent): void {
    const targetEl = event.target as HTMLElement;
    if (targetEl.nodeName !== 'CANVAS') {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.onMouseMove(event);
  }

  @ViewChild('canvas')
  canvas?: ElementRef<HTMLCanvasElement>;

  painting$ = new BehaviorSubject<boolean>(true);
  filling$ = new BehaviorSubject<boolean>(false);
  currentColor$ = new BehaviorSubject<string>('#000000');

  context?: CanvasRenderingContext2D | null;
  x = 0;
  y = 0;
  currentKey = '';
  header = OBJECT_STORE_HEADER;
  contents: any[] = [];
  selectedClothesList: string[] = [];

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
    const c_cs = getComputedStyle(canvas);
    const c_w = parseInt(c_cs.getPropertyValue('width'), 10);
    const c_h = parseInt(c_cs.getPropertyValue('height'), 10);

    canvas.width = c_w;
    canvas.height = c_h;

    this.context = canvas.getContext('2d');
    if (!this.context) {
      return;
    }
    this.context.lineWidth = 2.5;
    this.context.fillStyle = 'transparent';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.strokeStyle = '#000000'; // black
  }

  onMouseMove = (event: MouseEvent & TouchEvent): void => {
    if (!this.context) {
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.x = event.offsetX ?? event.touches[0].clientX - rect.left;
    this.y = event.offsetY ?? event.touches[0].clientY - rect.top;

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

  onChange($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const {value, checked} = target;

    if (checked) {
      this.selectedClothesList.push(value);
    } else {
      this.selectedClothesList = this.selectedClothesList.filter(clothes => clothes !== value);
    }
  }

  onLongPress(value: string): void {
    if (navigator.vibrate) {
      navigator.vibrate(2000);
    }
    if (window.confirm('선택한 아이템을 삭제하시겠습니까?')) {
      this.bucket.deleteObject({Bucket: environment.bucket_name, Key: value}, () => {
        this.getDatas();
        this.selectedClothesList = this.selectedClothesList.filter(clothes => clothes !== value);
      });
    }
  }

  onRangeChange = (event: Event): void => {
    if (!this.context) {
      return;
    }
    const value = (event.target as HTMLInputElement).value;
    this.context.lineWidth = parseFloat(value);
  };

  setCurrentColor = (event: Event): void => {
    if (!this.context) {
      return;
    }

    let color;

    if (event.type === 'click') {
      color = (event.target as HTMLElement).style.backgroundColor;
    } else {
      color = (event.target as HTMLInputElement).value;
    }

    this.context.strokeStyle = color;
    this.currentColor$.next(color);
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
    const wrapperEl = document.getElementById('mainWrapper');
    if (wrapperEl) {
      wrapperEl.style.overflowY = 'hidden';
    }

    this.painting$.next(true);
  };

  stopPainting = () => {
    const wrapperEl = document.getElementById('mainWrapper');
    if (wrapperEl) {
      wrapperEl.style.overflowY = 'scroll';
    }

    this.painting$.next(false);
    this.context?.beginPath();
  };

  startFilling = () => {
    this.filling$.next(true);
  };

  stopFilling = () => {
    this.filling$.next(false);
  };

  private uploadCanvasToServer() {
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const blobData = this.dataURItoBlob(dataUrl);
    const fileName = `${this.kakaoId}/${Date.now()}.png`;
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
      this.selectedClothesList.push(data.Key);
      this.onCanvasClear();
    });
  }

  private dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }

  private getDatas() {
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
