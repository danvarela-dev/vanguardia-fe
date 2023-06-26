import { Component, Input } from '@angular/core';
import { Place } from 'src/app/interfaces/place.interface';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent {
  @Input() place: Place;
}
