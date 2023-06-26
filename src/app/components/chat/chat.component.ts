import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, debounceTime, filter, takeUntil } from 'rxjs';
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

  constructor(
    private voiceService: VoiceService,
    private luisService: LuisService,
    private placesService: PlacesService
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

        if (highestProbability.includes('status')) {
          // todo call status endpoint
        } else if (highestProbability.includes('book')) {
          // todo call book endpoint
        }
      } else if (highestProbability.includes('place')) {
        this.currentState = 'place';
        console.log(entities);
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
