export type LocationOption = {
  group: string;
  name: string;
  lat: number;
  lng: number;
};

export const locationOptions: LocationOption[] = [
  { group: "2FTS", name: "RAF Syerston", lat: 53.023333, lng: -0.911667 },
  { group: "2FTS", name: "RAF Topcliffe", lat: 54.205556, lng: -1.382222 },
  { group: "2FTS", name: "RAF Little Risington", lat: 51.866667, lng: -1.7 },
  { group: "2FTS", name: "RAF Kenley", lat: 51.303611, lng: -0.095 },
  { group: "2FTS", name: "RAF Honington", lat: 52.3425, lng: 0.773056 },
  {
    group: "2FTS",
    name: "Upavon (Trenchard Lines)",
    lat: 51.290556,
    lng: -1.778333,
  },
  { group: "2FTS", name: "RAF Kirknewton", lat: 55.875278, lng: -3.3975 },
  {
    group: "2FTS",
    name: "Predannack Airfield",
    lat: 49.999167,
    lng: -5.230556,
  },

  { group: "RAFGSA", name: "Colerne", lat: 51.439167, lng: -2.286389 },
  { group: "RAFGSA", name: "Cranwell", lat: 53.0425, lng: -0.496 },
  { group: "RAFGSA", name: "Easterton", lat: 57.586496, lng: -3.321363 },
  { group: "RAFGSA", name: "Halton", lat: 51.791667, lng: -0.736111 },
  { group: "RAFGSA", name: "Odiham", lat: 51.234167, lng: -0.942778 },
  { group: "RAFGSA", name: "Shawbury", lat: 52.798056, lng: -2.668056 },
];
