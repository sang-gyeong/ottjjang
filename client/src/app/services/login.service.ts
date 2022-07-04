import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {map, tap} from 'rxjs/operators';

const dummyFeedList = [
  {
    createdAt: '20220417235613',
    createdBy: 'summer',
    imgUrl:
      'https://dthezntil550i.cloudfront.net/qr/latest/qr2007272346056350005347091/1280_960/54f52358-a75b-4c1c-84c9-70953b9f8c83.png',
    likeCounts: 13,
    title: 'hello hello',
    content: '테스트입니다',
  },
  {
    createdAt: '20220417235613',
    createdBy: 'winter',
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFg9F-o476_o9gG7pxhZSRB077MPnKMNIHZAxwS3zF0Sj1PPQa4_ea6KV9j3-Ldhmhe0g&usqp=CAU',
    likeCounts: 10,
    title: 'hello hello22',
    content: '테스트입니다22',
  },
  {
    createdAt: '20220417235613',
    createdBy: 'autumn',
    imgUrl:
      'https://dthezntil550i.cloudfront.net/qr/latest/qr2007272346056350005347091/1280_960/54f52358-a75b-4c1c-84c9-70953b9f8c83.png',
    likeCounts: 13,
    title: 'hello hello',
    content: '잘보여라 잘보여라',
  },
];

@Injectable()
export class LoginService {
  private main$: any;

  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    if (!this.main$) {
      this.refresh();
    }
    return this.main$;
  }

  redirectToLogin(url?: string, next?: string, force?: boolean): void {
    window.location.href = `${environment.service_url}/api/auth/login`;
  }

  refresh(): Observable<any> {
    return (this.main$ = this.http.get<any>(`${environment.service_url}/api/main`).pipe(
      shareReplay(1),
      map(response => ({...response, feedList: dummyFeedList}))
    ));
  }
}
