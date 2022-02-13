import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as AWS from 'aws-sdk';

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
  header = 'https://summber-obj.kr.object.ncloudstorage.com/';
  contents: any[] = [];
  backgroundColors = [
    'black',
    'white',
    'tomato',
    'orange',
    'gold',
    'green',
    'skyblue',
    'blue',
    'purple',
    'brown',
    'grey',
  ];

  constructor() {}

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
    this.context.strokeStyle = '#000000';
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
    console.log('uploadCanvasToServer');
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const blobData = this.dataURItoBlob(dataUrl);
    const fileName = `${Math.random() * 100}.png`;
    const params = {
      Bucket: 'summber-obj',
      Key: fileName,
      Body: blobData,
      ACL: 'public-read',
      ContentType: 'image/png',
    };
    const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
    const region = 'kr-standard';
    const bucket = new AWS.S3({
      endpoint,
      region,
      credentials: {
        accessKeyId: 'Uo8hRKPVxVAvpMN6IOtZ',
        secretAccessKey: 'NP6XeNgde0PPYKJNindruuGUlA8DlW6fVW1lgLRJ',
      },
    });
    bucket.upload(params, {}, (err, data) => {
      console.log(data);
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
    const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
    const region = 'kr-standard';
    const S3 = new AWS.S3({
      endpoint: endpoint,
      region: region,
      credentials: {
        accessKeyId: 'Uo8hRKPVxVAvpMN6IOtZ',
        secretAccessKey: 'NP6XeNgde0PPYKJNindruuGUlA8DlW6fVW1lgLRJ',
      },
    });
    const bucket_name = 'summber-obj';
    const MAX_KEYS = 300;
    const params = {
      Bucket: bucket_name,
      MaxKeys: MAX_KEYS,
    };
    const listAllKeys = (params: any, out = []) =>
      new Promise((resolve, reject) => {
        S3.listObjectsV2(params)
          .promise()
          .then(({Contents, IsTruncated, NextContinuationToken}) => {
            this.contents = Contents as any;
            console.log(Contents);
            !IsTruncated
              ? resolve(out)
              : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
          })
          .catch(reject);
      });
    listAllKeys({Bucket: 'summber-obj'});
  }

  onClickImg(key: string): void {
    console.log('key', key);
    this.currentKey = key;
  }
}
