import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private http: HttpClient) { }

  createRegion(url: string, region: Region): Observable<any> {
    return this.http.post(url, region, { withCredentials: true });
  }

  updateRegion(url: string, region: Region): Observable<any> {
    return this.http.put(url, region, { withCredentials: true });
  }
  
  getRegions(url: string): Observable<Region[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }
  
  deleteRegion(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
