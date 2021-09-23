import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Entry } from '../models/entrance';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  entry(entrance: Entry){
    return this.http.post(environment.postEntranceControl, entrance)
  }

}
