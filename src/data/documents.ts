import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type DocCategory = "Prescriptions" | "Reports" | "Insurance" | "Lab Tests" | "Identity" | "Other";

export type Doc = {
  id: string;
  name: string;
  date: string;
  size: string;
  category: DocCategory;
  icon: IconName;
  tone: TileTone;
};

export const documents: Doc[] = [
  {
    id: "1",
    name: "Biopsy Report.pdf",
    date: "12 Sep 2024",
    size: "2.4 MB",
    category: "Reports",
    icon: "document-text",
    tone: "rose",
  },
  {
    id: "2",
    name: "MRI Scan Report.pdf",
    date: "28 Aug 2024",
    size: "3.1 MB",
    category: "Reports",
    icon: "document-text",
    tone: "rose",
  },
  {
    id: "3",
    name: "Blood Test Results.jpg",
    date: "14 Aug 2024",
    size: "1.2 MB",
    category: "Lab Tests",
    icon: "image",
    tone: "mint",
  },
  {
    id: "4",
    name: "Chemotherapy Prescription.pdf",
    date: "02 Aug 2024",
    size: "900 KB",
    category: "Prescriptions",
    icon: "document-text",
    tone: "rose",
  },
  {
    id: "5",
    name: "Insurance Policy.pdf",
    date: "15 Jul 2024",
    size: "1.8 MB",
    category: "Insurance",
    icon: "shield-checkmark",
    tone: "sky",
  },
  {
    id: "6",
    name: "Aadhar Card.jpg",
    date: "10 Jul 2024",
    size: "700 KB",
    category: "Identity",
    icon: "image",
    tone: "mint",
  },
  {
    id: "7",
    name: "Hospital Discharge Summary.pdf",
    date: "22 Jun 2024",
    size: "1.5 MB",
    category: "Other",
    icon: "document-text",
    tone: "rose",
  },
];

export const docFilters = ["All", "Prescriptions", "Reports", "Insurance", "Other"];

/** Category chips that the "Other" filter rolls up. */
export const otherCategories: DocCategory[] = ["Lab Tests", "Identity", "Other"];
