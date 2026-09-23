/**
 * Phases of the CV access flow. Kept in their own tiny module so the provider
 * (always loaded) can use them without pulling in the lazily-loaded modal.
 */
export const CV_PHASES = {
  FORM: "form",
  GRANTING: "granting",
  SUCCESS: "success",
  ERROR: "error",
};
