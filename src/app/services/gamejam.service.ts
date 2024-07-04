import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameJam } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GamejamService {

  constructor(private http: HttpClient) {}

  createGameJam(url: string, gamejam: GameJam): Observable<any> {
    return this.http.post(url, gamejam, { withCredentials: true });
  }

  updateGameJam(url: string, gamejam: GameJam): Observable<any> {
    return this.http.put(url, gamejam,  { withCredentials: true });
  }

  getCurrentGameJam(url: string): Observable<GameJam> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  getGameJams(url: string): Observable<GameJam[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  getTimeRemainingData(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      map(response => response.timeRemaining)
    );
  }

  deleteGameJam(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
