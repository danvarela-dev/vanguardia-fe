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
    this.getCategories().subscribe(
      (categories) => {
        this.categories = categories.result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCategories(): Observable<ApiResponse<PlaceCategory[]>> {
    return this.http.get<ApiResponse<PlaceCategory[]>>(
      `${environment.endpoint}categories`,
      {
        headers: new HttpHeaders({ 'Skip-Interceptor': '' }),
      }
    );
  }

  getPlaces(payload: {
    City: string;
    Category: string;
  }): Observable<ApiResponse<Place[]>> {
    return this.http.post<ApiResponse<Place[]>>(
      `${environment.endpoint}api/v1/Place`,
      { ...payload },
      { headers: new HttpHeaders({ 'Skip-Interceptor': '' }) }
    );
  }
}
