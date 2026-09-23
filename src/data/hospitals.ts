import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type CostRow = { label: string; note?: string; value: string };
export type Doctor = { name: string; role: string; exp: string };
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
};

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "KCGMC Hospital",
    kind: "Government",
    city: "Kaithal, Haryana",
    pin: "136027",
    address: "Maharaja Agrasen Road, Kaithal, Haryana - 136027",
    distance: "2.4 km away",
    driveTime: "12 mins",
    rating: "4.5",
    reviews: 120,
    specialty: "Medical Oncology",
    cost: "₹35,000+",
    tagline: "Advanced Care. A Brighter Tomorrow.",
    photoCount: 5,
    years: "20+",
    about:
      "KCGMC Hospital is a leading government medical institute providing comprehensive cancer care with advanced technology and expert doctors. The hospital is committed to affordable and accessible treatment for all.",
    departments: [
      "Medical Oncology",
      "Surgical Oncology",
      "Radiation Therapy",
      "Pediatric Oncology",
      "Pathology",
      "Palliative Care",
    ],
    specialties: [
      { label: "Cancer Care Specialists", icon: "ribbon", tone: "green" },
      { label: "Advanced Radiotherapy", icon: "pulse", tone: "rose" },
      { label: "Chemotherapy Unit", icon: "flask", tone: "sky" },
      { label: "Surgical Oncology", icon: "medkit", tone: "violet" },
      { label: "Pathology & Diagnostics", icon: "search-circle", tone: "amber" },
      { label: "Patient Support Services", icon: "people", tone: "mint" },
    ],
    costs: [
      { label: "Initial Consultation", value: "₹ 500 – 1,000" },
      { label: "Chemotherapy", note: "(per cycle)", value: "₹ 10,000 – 25,000" },
      { label: "Radiation Therapy", note: "(per session)", value: "₹ 2,500 – 5,000" },
      { label: "Surgery", note: "(major)", value: "₹ 1,50,000 – 3,00,000" },
    ],
    doctors: [
      { name: "Dr. A. Verma", role: "Medical Oncologist", exp: "14 yrs experience" },
      { name: "Dr. S. Kaushik", role: "Surgical Oncologist", exp: "11 yrs experience" },
      { name: "Dr. P. Rana", role: "Radiation Oncologist", exp: "9 yrs experience" },
    ],
    facilities: [
      "24x7 Emergency",
      "In-house Pharmacy",
      "Day-care Chemotherapy",
      "Ambulance Service",
      "Attendant Accommodation",
      "Cashless Insurance Desk",
    ],
    schemes: [
      "PM-JAY (Ayushman Bharat)",
      "State Government Schemes",
      "CGHS / ECHS",
      "Other Insurance Plans",
    ],
    phone: "+91 1746 000000",
  },
  {
    id: "2",
    name: "Civil Hospital, Kaithal",
    kind: "Government",
    city: "Kaithal, Haryana",
    pin: "136027",
    address: "Civil Lines, Kaithal, Haryana - 136027",
    distance: "12 km away",
    driveTime: "24 mins",
    rating: "4.5",
    reviews: 120,
    specialty: "Cancer Care",
    cost: "₹28,000+",
    tagline: "Care Within Reach.",
    photoCount: 4,
    years: "35+",
    about:
      "A leading government hospital providing affordable cancer treatment with modern facilities and an experienced oncology team.",
    departments: ["Medical Oncology", "General Surgery", "Radiology", "Palliative Care"],
    specialties: [
      { label: "Cancer Care Specialists", icon: "ribbon", tone: "green" },
      { label: "Chemotherapy Unit", icon: "flask", tone: "sky" },
      { label: "Pathology & Diagnostics", icon: "search-circle", tone: "amber" },
      { label: "Patient Support Services", icon: "people", tone: "mint" },
    ],
    costs: [
      { label: "Initial Consultation", value: "₹ 300 – 700" },
      { label: "Chemotherapy", note: "(per cycle)", value: "₹ 8,000 – 20,000" },
      { label: "Radiation Therapy", note: "(per session)", value: "₹ 2,000 – 4,000" },
      { label: "Surgery", note: "(major)", value: "₹ 1,00,000 – 2,50,000" },
    ],
    doctors: [
      { name: "Dr. M. Singh", role: "Medical Oncologist", exp: "16 yrs experience" },
      { name: "Dr. N. Bhatia", role: "General Surgeon", exp: "12 yrs experience" },
    ],
    facilities: ["24x7 Emergency", "In-house Pharmacy", "Ambulance Service", "Blood Bank"],
    schemes: ["PM-JAY (Ayushman Bharat)", "State Government Schemes", "CGHS / ECHS"],
    phone: "+91 1746 111111",
  },
  {
    id: "3",
    name: "Aarogyam Cancer Centre",
    kind: "Private",
    city: "Kurukshetra, Haryana",
    pin: "136118",
    address: "Sector 7, Kurukshetra, Haryana - 136118",
    distance: "32 km away",
    driveTime: "48 mins",
    rating: "4.6",
    reviews: 210,
    specialty: "Multi-Speciality",
    cost: "₹52,000+",
    tagline: "Precision Oncology, Personal Care.",
    photoCount: 6,
    years: "12+",
    about:
      "A multi-speciality private centre offering precision oncology, day-care chemotherapy and advanced imaging under one roof.",
    departments: [
      "Medical Oncology",
      "Surgical Oncology",
      "Radiation Therapy",
      "Nuclear Medicine",
      "Nutrition",
    ],
    specialties: [
      { label: "Cancer Care Specialists", icon: "ribbon", tone: "green" },
      { label: "Advanced Radiotherapy", icon: "pulse", tone: "rose" },
      { label: "Chemotherapy Unit", icon: "flask", tone: "sky" },
      { label: "Nutrition & Lifestyle", icon: "nutrition", tone: "mint" },
    ],
    costs: [
      { label: "Initial Consultation", value: "₹ 800 – 1,500" },
      { label: "Chemotherapy", note: "(per cycle)", value: "₹ 18,000 – 45,000" },
      { label: "Radiation Therapy", note: "(per session)", value: "₹ 4,000 – 8,000" },
      { label: "Surgery", note: "(major)", value: "₹ 2,50,000 – 4,50,000" },
    ],
    doctors: [
      { name: "Dr. R. Malhotra", role: "Medical Oncologist", exp: "18 yrs experience" },
      { name: "Dr. K. Iyer", role: "Radiation Oncologist", exp: "10 yrs experience" },
    ],
    facilities: [
      "24x7 Emergency",
      "In-house Pharmacy",
      "Day-care Chemotherapy",
      "PET-CT Imaging",
      "Cashless Insurance Desk",
    ],
    schemes: ["PM-JAY (Ayushman Bharat)", "Other Insurance Plans"],
    phone: "+91 1744 222222",
  },
  {
    id: "4",
    name: "Sunrise Oncology Hospital",
    kind: "Private",
    city: "Karnal, Haryana",
    pin: "132001",
    address: "Mall Road, Karnal, Haryana - 132001",
    distance: "45 km away",
    driveTime: "1 hr 5 mins",
    rating: "4.2",
    reviews: 76,
    specialty: "Radiation Therapy",
    cost: "₹48,000+",
    tagline: "Every Day, A Step Forward.",
    photoCount: 3,
    years: "8+",
    about:
      "A dedicated oncology hospital focused on radiation therapy and long-term survivorship care.",
    departments: ["Radiation Therapy", "Medical Oncology", "Palliative Care"],
    specialties: [
      { label: "Advanced Radiotherapy", icon: "pulse", tone: "rose" },
      { label: "Cancer Care Specialists", icon: "ribbon", tone: "green" },
      { label: "Patient Support Services", icon: "people", tone: "mint" },
    ],
    costs: [
      { label: "Initial Consultation", value: "₹ 700 – 1,200" },
      { label: "Chemotherapy", note: "(per cycle)", value: "₹ 15,000 – 35,000" },
      { label: "Radiation Therapy", note: "(per session)", value: "₹ 3,500 – 7,000" },
      { label: "Surgery", note: "(major)", value: "₹ 2,00,000 – 3,50,000" },
    ],
    doctors: [{ name: "Dr. V. Chauhan", role: "Radiation Oncologist", exp: "13 yrs experience" }],
    facilities: ["In-house Pharmacy", "Day-care Chemotherapy", "Ambulance Service"],
    schemes: ["PM-JAY (Ayushman Bharat)", "Other Insurance Plans"],
    phone: "+91 184 333333",
  },
];

export const hospitalFilters = ["Nearest", "Best Rated", "Government", "Private"];

export const hospitalTabs = [
  "Overview",
  "Departments",
  "Doctors",
  "Treatment & Cost",
  "Facilities",
  "Reviews",
];
