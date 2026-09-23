/**
 * Choice lists for the signup form.
 *
 * States and districts are NOT duplicated here — they come from `state.tsx`,
 * which already carries every state/UT with its full district list.
 */

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

/**
 * Family / income disclosure. These drive the eligibility hints for the
 * assistance schemes shown elsewhere in the app, so the bands mirror the
 * thresholds those schemes actually use.
 */
export const INCOME_BANDS = [
  "Below ₹1,00,000",
  "₹1,00,000 – ₹3,00,000",
  "₹3,00,000 – ₹5,00,000",
  "₹5,00,000 – ₹8,00,000",
  "Above ₹8,00,000",
  "Prefer not to say",
];

export const RATION_CARDS = [
  "BPL (Below Poverty Line)",
  "AAY (Antyodaya)",
  "APL (Above Poverty Line)",
  "No ration card",
];

export const INSURANCE_STATUS = [
  "Yes — PM-JAY / Ayushman Bharat",
  "Yes — private insurance",
  "No",
  "Not sure",
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Days in a month, accounting for leap years. */
export function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** "12 / 03 / 1985" — the display format used by the Date of Birth field. */
export function formatDob(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}
