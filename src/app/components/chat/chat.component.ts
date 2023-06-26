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

  constructor(
    private voiceService: VoiceService,
    private luisService: LuisService
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

    this.chatControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(1500))
      .subscribe((value) => {
        this.luisService.postUtterance(value).subscribe((response) => {
          // TODO: Handle response, wait for BE
          const { result } = response;
          console.log(result);
        });
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
