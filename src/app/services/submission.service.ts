import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating, Submission } from '../../types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient) { }

  createSubmission(url: string, team: Submission): Observable<any> {
    return this.http.post(url, team, { withCredentials: true });
  }
  
  updateSubmission(url: string, team: Submission): Observable<any> {
    return this.http.put(url, team, { withCredentials: true });
  }

  getSubmission(url: string): Observable<Submission> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }
  getSubmissionName(url: string): Observable<Submission> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  getCurrentTeamSubmission(url: string): Observable<Submission> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  giveRating(url: string, evaluation: Rating): Observable<any> {
    return this.http.post(url, evaluation, { withCredentials: true });
  }

  getRating(url: string): Observable<Rating>{
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  getSubmissionsEvaluator(url: string): Observable<Submission[]>{
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

  getRatingsEvaluator(url: string): Observable<Submission[]>{
    return this.http.get<any>(url, { withCredentials: true }).pipe(
      map(response => response.data) 
    );
  }

}
