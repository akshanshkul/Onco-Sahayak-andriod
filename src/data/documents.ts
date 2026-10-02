import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type DocCategory = "Prescriptions" | "Reports" | "Insurance" | "Lab Tests" | "Identity" | "Other";

export type Doc = {
  id: string;
  key?: string;
  name: string;
  date: string;
  size: string;
  category: DocCategory;
  icon: IconName;
  tone: TileTone;
};

export const docFilters = ["All", "Prescriptions", "Reports", "Insurance", "Other"];

/** Category chips that the "Other" filter rolls up. */
export const otherCategories: DocCategory[] = ["Lab Tests", "Identity", "Other"];
