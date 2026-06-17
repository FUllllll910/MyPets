type MyPetsWindow = Window & {
  mypets?: Window["mypets"];
  pawpal?: Window["mypets"];
};

export function mypetsApi(): Window["mypets"] | undefined {
  const api = (window as MyPetsWindow).mypets ?? (window as MyPetsWindow).pawpal;
  if (api && !(window as MyPetsWindow).mypets) {
    (window as MyPetsWindow).mypets = api;
  }
  return api;
}
