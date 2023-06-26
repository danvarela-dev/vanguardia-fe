import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const { body } = request;
    const bodyObj = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v != null)
    );

    const clonedRequest = request.clone({
      headers: new HttpHeaders({
        'Ocp-Apim-Subscription-Key': environment.key1,
      }),
      body: {
        ...bodyObj,
        kind: 'Conversation',
        parameters: {
          projectName: `${environment.projectname}`,
          deploymentName: `${environment.deploymentname}`,
          stringIndexType: 'TextElement_V8',
        },
      },
    });

    return next.handle(clonedRequest);
  }
}
