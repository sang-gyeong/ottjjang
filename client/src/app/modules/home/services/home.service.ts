import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {of} from 'rxjs';

@Injectable()
export class HomeService {
  constructor(private http: HttpClient) {}

  loadFeedContents(): Observable<any> {
    return this.http.get<any>(`${environment.service_url}/api/main`);
  }
}
