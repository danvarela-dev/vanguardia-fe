import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/api-response.interface';
import { Place, PlaceCategory } from 'src/app/interfaces/place.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class PlacesService {
  categories: PlaceCategory[] = [];

  constructor(private http: HttpClient) {
    this.getCategories().subscribe((categories) => {
      this.categories = categories.result;
    });
  }

  getCategories(): Observable<ApiResponse<PlaceCategory[]>> {
    return this.http.get<ApiResponse<PlaceCategory[]>>(
      `${environment.endpoint}Categories`,
      {
        headers: new HttpHeaders({ 'Skip-Interceptor': '' }),
      }
    );
  }

  getPlaces(payload: {
    city: string;
    category: string;
  }): Observable<ApiResponse<Place[]>> {
    return this.http.get<ApiResponse<Place[]>>(`${environment.endpoint}place`, {
      headers: new HttpHeaders({ 'Skip-Interceptor': '' }),
      params: payload,
    });
  }
}
