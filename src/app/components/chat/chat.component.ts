import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  filter,
  finalize,
  takeUntil,
} from 'rxjs';
import { Place, PlaceCategory } from 'src/app/interfaces/place.interface';
import { FlightService } from 'src/app/services/flight/flight.service';
import { LuisService } from 'src/app/services/luis/luis.service';
import { PlacesService } from 'src/app/services/places/places.service';
import { VoiceService } from 'src/app/services/voice/voice.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatControl = new FormControl();
  unsubscribe$ = new Subject<void>();
  listening = false;
  currentState: 'flight' | 'place' | 'calendar' | 'none' = 'none';
  places: Place[] = [];
  loading = false;

  constructor(
    private voiceService: VoiceService,
    private luisService: LuisService,
    private placesService: PlacesService,
    private flightService: FlightService
  ) {}

  ngOnInit(): void {
    this.voiceService
      .init()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.listening = false;
      });

    this.voiceService
      .speechInput()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((input) => {
        this.chatControl.setValue(input);
      });
  }

  sendChat(): void {
    this.loading = true;
    const query = this.chatControl.value;
    this.luisService.postUtterance(query).subscribe((response) => {
      const {
        result: {
          prediction: { intents, entities },
        },
      } = response;
      const highestProbability = intents[0].category.toLocaleLowerCase();

      if (highestProbability.includes('flight')) {
        this.currentState = 'flight';
        console.log('flight');
        console.log(highestProbability);
        console.log(entities);

        const dateStr = entities.find((e) => e.category === 'Date');
        let dateObj: Date;
        const arrivalAirport = entities.find(
          (e) => e.category === 'arrivalAirport'
        );

        let source = entities.find((e) => e.category === 'source');
        if (arrivalAirport === source) {
          source = entities.find((e) => e.category === 'destination');
        }

        if (dateStr.text === 'mañana') {
          dateObj = new Date();
          dateObj.setDate(dateObj.getDate() + 1);
        } else {
          dateObj = new Date(dateStr.text);
        }

        if (
          highestProbability.includes('search') ||
          highestProbability.includes('status')
        ) {
          debugger;

          this.flightService
            .searchFlight(
              `${dateObj.getFullYear()}-${
                dateObj.getMonth() + 1
              }-${dateObj.getDate()}`,
              `${source.text}`,
              `${arrivalAirport.text}`
            )
            .subscribe(
              (flights) => {
                console.log(flights);
              },
              (error) => {
                console.log(error);
              }
            );
        }
      } else if (highestProbability.includes('place')) {
        this.currentState = 'place';
        const placeCategory = entities.filter((e) => e.category === 'place');
        let foundCategory: PlaceCategory;
        let foundCity;
        placeCategory.forEach((place, i) => {
          const category = this.placesService.categories
            .filter((cat) => cat !== undefined)
            .find(
              (categ) =>
                categ.pluralName === place.text ||
                categ.singularName === place.text
            );

          if (category) {
            foundCategory = category;
          } else {
            foundCity = place.text;
          }
        });

        this.placesService
          .getPlaces({ City: foundCity, Category: foundCategory.key })
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(
            (places) => {
              this.places = places.result;
            },
            (error) => console.log(error)
          );
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleListening(): void {
    this.listening = !this.listening;
    if (this.listening) {
      this.chatControl.reset();
      this.voiceService.start();
    } else {
      this.voiceService.stop();
    }
  }
}
