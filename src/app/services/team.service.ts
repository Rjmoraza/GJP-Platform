import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  createTeam(url: string, team: Team): Observable<any> {
    return this.http.post(url, team, { withCredentials: true });
  }

  getTeamById(url: string): Observable<Team> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  addJammerToTeam(url: string): Observable<any> {
    return this.http.post(url, { withCredentials: true });
  }

  removeJammerFromTeam(url: string): Observable<any> {
    return this.http.delete(url, { withCredentials: true });
  }

  updateTeam(url: string, team: Team): Observable<any> {
    return this.http.put(url, team, { withCredentials: true });
  }
  
  getTeams(url: string): Observable<Team[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }

  deleteTeam(url: string): Observable<any> {
    return this.http.delete(url);
  }
  
  getTeamsSite(url: string): Observable<Team[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
}
