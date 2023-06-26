import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/api-response.interface';
import { FlightInfo } from 'src/app/interfaces/flight.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class FlightService {
  constructor(private http: HttpClient) {}

  getFlights(): Observable<ApiResponse<FlightInfo>> {
    return this.http.get<ApiResponse<FlightInfo>>(
      `${environment.endpoint}flights`,
      { headers: new HttpHeaders({ 'Skip-Interceptor': '' }) }
    );
  }

  getFlightById(id: string): Observable<ApiResponse<FlightInfo>> {
    return this.http.get<ApiResponse<FlightInfo>>(
      `${environment.endpoint}flights/${id}`,
      { headers: new HttpHeaders({ 'Skip-Interceptor': '' }) }
    );
  }

  searchFlight(
    date: string,
    destination: string,
    source: string
  ): Observable<ApiResponse<FlightInfo>> {
    return this.http.get<ApiResponse<FlightInfo>>(
      `${environment.endpoint}api/v1/Flight/source/${source}/destination/${destination}/date/${date}`,
      { headers: new HttpHeaders({ 'Skip-Interceptor': '' }) }
    );
  }
}
