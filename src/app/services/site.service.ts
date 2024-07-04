import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, Site } from '../../types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http: HttpClient) { }

  createSite(url: string, site: Site): Observable<any> {
    return this.http.post(url, site, { withCredentials: true });
  }
  
  updateSite(url: string, site: Site): Observable<any> {
    return this.http.put(url, site, { withCredentials: true });
  }

  getSites(url: string): Observable<Site[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }

  getSite(url: string): Observable<Site> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe( 
      map(response => response.data)
    );
  }

  getCountries(url: string): Observable<Country[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }

  getSubmissions(url: string): Observable<any[]> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe( 
      map(response => response.data)
    );
  }
  getSubmissionsByName(url: string): Observable<any[]> { 
    return this.http.get<any>(url, { withCredentials: true }).pipe( 
      map(response => response.data)
    );
  }

  getSitesPerRegion(url: string): Observable<Site[]> { 
    return this.http.get<any>(url).pipe( 
      map(response => response.data)
    );
  }

  deleteSite(url: string): Observable<any> {
    return this.http.delete(url);
  }
}
