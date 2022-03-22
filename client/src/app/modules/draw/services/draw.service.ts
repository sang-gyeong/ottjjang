import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk';
import {AWSError, EnvironmentCredentials} from 'aws-sdk';
import * as S3 from 'aws-sdk/clients/s3';
import {ListObjectsV2Output} from 'aws-sdk/clients/s3';
import {AnyRecord} from 'dns';
import {ConnectableObservable, from, Observable, Subject} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {bucket} from '../consts';

@Injectable()
export class DrawService {
  constructor(private http: HttpClient) {}

  refresh(): Observable<any> {
    return this.http.get<any>(`${environment.service_url}/api/main`).pipe(shareReplay(1));
  }

  loadDrawContents(params: AWS.S3.ListObjectsV2Request): Observable<{success: boolean; data: any}> {
    return new Observable<S3.ObjectList>(observer => {
      bucket.listObjectsV2(params, (error, {Contents}) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(Contents);
          observer.complete();
        }
      });
    }).pipe(switchMap(() => this.http.get<any>(`${environment.service_url}/api/clothes`)));
  }

  deleteClothesItem(key: string, id: number): Observable<any> {
    return new Observable<string>(observer => {
      bucket.deleteObject({Bucket: environment.bucket_name, Key: key}, error => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(key);
          observer.complete();
        }
      });
    }).pipe(
      switchMap(() =>
        this.http.delete(`${environment.service_url}/api/clothes`, {
          params: new HttpParams().append('id', id),
        })
      )
    );
  }

  saveClothesItem(fileName: string, blobData: Blob): Observable<any> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: environment.bucket_name,
      Key: fileName,
      Body: blobData,
      ACL: 'public-read',
      ContentType: 'image/png',
    };

    return new Observable<string>(observer => {
      bucket.upload(params, {}, (error, data) => {
        if (error) {
          observer.error(error);
        } else {
          alert('UPLOADED');
          observer.next(data.Key);
          observer.complete();
        }
      });
    }).pipe(
      switchMap(key => {
        return this.http.post(`${environment.service_url}/api/clothes`, {key});
      })
    );
  }

  saveStatus(body: any): Observable<any> {
    return this.http.post(`${environment.service_url}/api/clothes/status`, body);
  }
}

// const params: AWS.S3.PutObjectRequest = {
//   Bucket: environment.bucket_name,
//   Key: fileName,
//   Body: blobData,
//   ACL: 'public-read',
//   ContentType: 'image/png',
// };

// return new Observable<string>(observer => {
//   bucket.upload(params, {}, (error, data) => {
//     if (error) {
//       observer.error(error);
//     } else {
//       alert('UPLOADED');
//       observer.next(data.Key);
//       observer.complete();
//     }
//   });
// });
