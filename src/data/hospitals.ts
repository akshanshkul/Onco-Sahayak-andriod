import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type CostRow = { label: string; note?: string; value: string };
export type Doctor = { name: string; role: string; exp: string };
export type HospitalReview = { name: string; rating: number; date: string; text: string };
export type Specialty = { label: string; icon: IconName; tone: TileTone };

export type Hospital = {
  id: string;
  name: string;
  kind: "Government" | "Private";
  city: string;
  pin: string;
  address: string;
  distance: string;
  driveTime: string;
  rating: string;
  reviews: number;
  review_items?: HospitalReview[];
  specialty: string;
  cost: string;
  tagline: string;
  photoCount: number;
  years: string;
  about: string;
  departments: string[];
  specialties: Specialty[];
  costs: CostRow[];
  doctors: Doctor[];
  facilities: string[];
  schemes: string[];
  phone: string;
  website?: string;
  contactEmail?: string;
  emergencyPhone?: string;
  hours?: string;
  bannerUrl?: string;
};

export const hospitalFilters = ["Nearest", "Best Rated", "Government", "Private"];

export const hospitalTabs = [
  "Overview",
  "Departments",
  "Doctors",
  "Treatment & Cost",
  "Facilities",
  "Reviews",
];
