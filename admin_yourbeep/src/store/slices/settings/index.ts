export { settingsReducer } from "./settingsSlice";
export {
  createPlatformFaq,
  deletePlatformFaq,
  fetchPlatformSettings,
  updatePlatformFaq,
  updatePlatformSettings,
} from "./settingsThunk";
export type { PlatformFaqItem, PlatformSettingsData, SettingsState } from "./settingsTypes";
