import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from 'src/app/interfaces/luis-response.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class LuisService {
  constructor(private http: HttpClient) {}

  postUtterance(query: string): Observable<Response> {
    const body = {
      analysisInput: {
        conversationItem: {
          id: '1',
          participantId: '1',
          text: query,
        },
      },
    };
    return this.http.post<Response>(
      `${environment.luisendpoint}language/:analyze-conversations?api-version=2023-04-01`,
      body
    );
  }
}
