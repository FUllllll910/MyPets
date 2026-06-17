import { allPets } from "../../shared/bundledPets";
import { PETDEX_SPRITE_SIZE, PETDEX_STATES, mapPetStateToPetdexState } from "../../shared/spriteStates";
import type { CustomGifPet, InstalledPet, PetState, SpriteAnimationState } from "../../shared/types";

export type SpritePetAsset = {
  kind: "sprite";
  src: string;
  animation: SpriteAnimationState;
  frameWidth: number;
  frameHeight: number;
  sheetWidth: number;
  sheetHeight: number;
};

export type FallbackPetAsset = {
  kind: "fallback";
};

export type GifPetAsset = {
  kind: "gif";
  src: string;
};

export type PetAsset = SpritePetAsset | GifPetAsset | FallbackPetAsset;

export function getSelectedPetAsset(
  selectedPetId: string,
  installedPets: InstalledPet[],
  state: PetState,
  customGifPet?: CustomGifPet
): PetAsset {
  const petdexState = mapPetStateToPetdexState(state);
  const gifPath = customGifPet?.enabled
    ? customGifPet.gifs[petdexState] ?? customGifPet.gifs.idle
    : undefined;
  if (gifPath) {
    return {
      kind: "gif",
      src: new URL(window.mypets.assetUrl(gifPath)).href
    };
  }

  const installed = allPets(installedPets).find((pet) => pet.slug === selectedPetId) ?? allPets(installedPets)[0];
  if (!installed) {
    return { kind: "fallback" };
  }

  const src = new URL(window.mypets.assetUrl(installed.spritesheetPath));

  return {
    kind: "sprite",
    src: src.href,
    animation: PETDEX_STATES[petdexState],
    frameWidth: PETDEX_SPRITE_SIZE.frameWidth,
    frameHeight: PETDEX_SPRITE_SIZE.frameHeight,
    sheetWidth: PETDEX_SPRITE_SIZE.sheetWidth,
    sheetHeight: PETDEX_SPRITE_SIZE.sheetHeight
  };
}
