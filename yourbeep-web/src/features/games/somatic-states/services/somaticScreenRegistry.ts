import { chestScreens } from "../chest/chestScreens";
import { faceThroatScreens } from "../face-throat/faceThroatScreens";
import { handsLegsScreens } from "../hands-legs/handsLegsScreens";
import { headScreens } from "../head/headScreens";
import { heartScreens } from "../heart/heartScreens";
import { stomachScreens } from "../stomach/stomachScreens";
import type { SomaticScreenDefinition } from "./somaticScreenTypes";

const somaticScreenRegistry: Record<string, SomaticScreenDefinition> = {
  ...headScreens,
  ...faceThroatScreens,
  ...heartScreens,
  ...chestScreens,
  ...stomachScreens,
  ...handsLegsScreens,
};

export const getSomaticScreenDefinition = (activityKey: string) =>
  somaticScreenRegistry[activityKey] ?? null;

export default somaticScreenRegistry;
