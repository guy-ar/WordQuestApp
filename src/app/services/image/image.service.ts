import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiKey = environment.PEXELS_API_KEY; // Replace with your actual Pexels API key
  private apiUrl = environment.PEXELS_API_URL;

  constructor(private http: HttpClient) {}

  getImageForWord(word: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': this.apiKey
    });

    return this.http.get(`${this.apiUrl}?query=${word}&per_page=1`, { headers }).pipe(
      map((response: any) => {
        if (response.photos && response.photos.length > 0) {
          return response.photos[0].src.medium;
        }
        return ''; // Return empty string if no image found
      })
    );
  }
}