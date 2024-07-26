import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jam } from '../../types';
import { map } from 'rxjs/operators';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class JamService {

  constructor(private http: HttpClient) { }

  createJam(url: string, jam: Jam): Observable<any>{
    return this.http.post(url, jam, {withCredentials: true});
  }

  updateJam(url: string, jam: Jam): Observable<any>{
    return this.http.put(url, jam, {withCredentials: true});
  }

  getCurrentJam(url: string): Observable<Jam> {
    return this.http.get<any>(url).pipe(
      map(response => response.data)
    );
  }

  listJams(url: string): Observable<Jam[]>{
    return this.http.get<any>(url).pipe(
      map(response => response.data)
    );
  }
}
