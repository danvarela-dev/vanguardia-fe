export interface FlightInfo {
  flightDate: string;
  flightStatus: string;
  departure: Departure;
  arrival: Arrival;
  airline: Airline;
  flight: Flight;
  aircraft: any;
  live: any;
}

export interface Departure {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string;
  gate: string;
  delay: any;
  scheduled: string;
  estimated: string;
  actual: any;
  estimatedRunway: any;
  actualRunway: any;
}

export interface Arrival {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: any;
  gate: any;
  delay: any;
  scheduled: string;
  estimated: string;
  actual: any;
  estimatedRunway: any;
  actualRunway: any;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface Flight {
  number: string;
  iata: string;
  icao: string;
  codeshared: Codeshared;
}

export interface Codeshared {
  airlineName: string;
  airlineIata: string;
  airlineIcao: string;
  flightNumber: string;
  flightIata: string;
  flightIcao: string;
}
