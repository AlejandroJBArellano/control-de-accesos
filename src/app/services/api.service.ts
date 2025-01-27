import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  userTagId(tag_id: string) {
    return this.http.get(environment.tag_id, {
      params: {
        tag_id,
      },
    });
  }
  getConfigEntrances() {
    return this.http.get(environment.configEntrance);
  }
}
