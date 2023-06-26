import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { VoiceService } from './services/voice/voice.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LuisService } from './services/luis/luis.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './interceptor/request.interceptor';
import { PlacesService } from './services/places/places.service';
import { FlightService } from './services/flight/flight.service';
import { FlightCardComponent } from './components/flight-card/flight-card.component';
import { PlaceCardComponent } from './components/place-card/place-card.component';

@NgModule({
  declarations: [AppComponent, ChatComponent, FlightCardComponent, PlaceCardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    VoiceService,
    LuisService,
    PlacesService,
    FlightService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
