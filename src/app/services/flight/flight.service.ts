import { HttpClient } from '@angular/common/http';
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
      `${environment.endpoint}flights`
    );
  }

  // postFlight(): Observable
}
