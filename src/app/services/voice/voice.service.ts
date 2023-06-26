import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

declare const webkitSpeechRecognition: any;

@Injectable()
export class VoiceService {
  recognition: any;
  isStoppedSpeechRecog = false;
  public text = '';
  private voiceToTextSubject: Subject<string> = new Subject();
  private speakingPaused: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private tempWords: string = '';
  constructor() {}

  speechInput() {
    return this.voiceToTextSubject.asObservable();
  }

  init(): Observable<boolean> {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'es';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      this.voiceToTextSubject.next(this.text || transcript);
    });
    return this.initListeners();
  }

  initListeners() {
    this.recognition.addEventListener('end', () => {
      this.recognition.stop();
    });
    return this.speakingPaused.asObservable();
  }

  start(): void {
    this.text = '';
    this.isStoppedSpeechRecog = false;

    if (
      !this.recognition.lastActiveTime ||
      Date.now() - this.recognition.lastActive > 200
    ) {
      this.recognition.start();
      this.recognition.lastActive = Date.now();
    }

    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.isActive = true;
        this.recognition.stop();
      } else {
        this.isStoppedSpeechRecog = false;
        this.wordConcat();
        if (
          !this.recognition.lastActiveTime ||
          Date.now() - this.recognition.lastActive > 200
        ) {
          this.recognition.start();
          debugger;
          this.recognition.lastActive = Date.now();
        }
      }
      this.voiceToTextSubject.next(this.text);
    });
  }

  stop(): void {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    this.recognition.isActive = false;
    this.speakingPaused.next(true);
  }

  wordConcat(): void {
    this.text = this.text.trim() + ' ' + this.tempWords;
    this.text = this.text.trim();
    this.tempWords = '';
  }
}
