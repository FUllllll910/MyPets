/// <reference types="vite/client" />

import type { MyPetsApi } from "../preload";

declare global {
  interface Window {
    mypets: MyPetsApi;
    pawpal?: MyPetsApi;
  }
}
