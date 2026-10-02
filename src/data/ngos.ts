import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type SupportKind = "NGO" | "Government" | "Trust";

export type Ngo = {
  id: string;
  name: string;
  kind: SupportKind;
  /** Label shown on the tag chip next to the name. */
  kindLabel: string;
  logoIcon: IconName;
  logoTone: TileTone;
  summary: string;
  region: string;
  covers: string;
  amountLabel: string;
  amount: string;

  /* Detail screen */
  about: string;
  coverage: string[];
  eligibility: string[];
  documents: string[];
  howToApply: string[];
  processingTime: string;
  phone: string;
  website: string;
  contactEmail?: string;
  bannerUrl?: string;
};

export const assistanceFilters = [
  "All",
  "NGOs",
  "Government Schemes",
  "Trusts & Foundations",
];

/** Maps a filter chip to the record kinds it should show. */
export const assistanceFilterMap: Record<string, SupportKind[] | null> = {
  All: null,
  NGOs: ["NGO"],
  "Government Schemes": ["Government"],
  "Trusts & Foundations": ["Trust"],
};
