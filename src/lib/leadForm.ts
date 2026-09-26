// The booking calendar's qualifying question — shared by the form and the
// API route so the allowed values stay in sync. The labels are exactly what
// lands in the GHL contact field "Which Best Describes You?".

export const ROLE_OPTIONS = [
  { value: "dealership", label: "I own or manage a car dealership" },
  { value: "salesman", label: "I'm a car salesman" },
] as const;

export type Role = (typeof ROLE_OPTIONS)[number]["value"];

export function isRole(value: unknown): value is Role {
  return ROLE_OPTIONS.some((opt) => opt.value === value);
}

/** GHL contact custom-field names the booking fills (looked up by name, case-insensitive). */
export const GHL_FIELD_ROLE = "Which Best Describes You?";
export const GHL_FIELD_MESSAGE = "What Would You Like Help With?";
