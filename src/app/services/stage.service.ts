import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  constructor(private http: HttpClient) { }

  createStage(url: string, stage: Stage): Observable<any> {
    return this.http.post(url, stage, { withCredentials: true });
  }

  updateStage(url: string, stage: Stage): Observable<any> {
    return this.http.put(url, stage, { withCredentials: true });
  }

  getCurrentStage(url: string): Observable<Stage> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  getStages(url: string): Observable<Stage[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  deleteStage(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
