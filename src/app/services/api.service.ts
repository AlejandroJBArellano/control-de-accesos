import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUserTagID } from '../types/tagIdUser';

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
  getConfigTags() {
    return this.http.get(environment.configEntrance);
  }
}
