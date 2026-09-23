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
};

export const ngos: Ngo[] = [
  {
    id: "1",
    name: "Tata Trusts Cancer Care",
    kind: "Trust",
    kindLabel: "NGO",
    logoIcon: "business",
    logoTone: "sky",
    summary: "Financial assistance for cancer treatment, medicines and supportive care.",
    region: "Pan India (Supports Haryana)",
    covers: "Treatment cost, Medicines, Surgery",
    amountLabel: "Financial Support",
    amount: "Up to ₹5,00,000",
    about:
      "Tata Trusts runs one of India's largest philanthropic cancer care programmes, funding treatment for patients who cannot meet the cost themselves. Support is routed through partner hospitals and assessed case by case against household income.",
    coverage: [
      "Chemotherapy and radiation cycles",
      "Surgery and hospitalisation",
      "Prescribed medicines",
      "Diagnostic tests and imaging"
    ],
    eligibility: [
      "Confirmed cancer diagnosis with medical records",
      "Annual family income generally below Rs 3,00,000",
      "Treatment at a recognised or partner hospital",
      "Indian citizen with valid photo ID"
    ],
    documents: [
      "Diagnosis report and treating doctor's prescription",
      "Hospital cost estimate on letterhead",
      "Income certificate or salary proof",
      "Aadhaar card and recent photograph",
      "Bank account details of the patient"
    ],
    howToApply: [
      "Collect your diagnosis report and hospital cost estimate",
      "Apply through your hospital's medical social worker",
      "Attach income proof and identity documents",
      "Await verification - the hospital is contacted directly",
      "Approved funds are released to the hospital, not the patient"
    ],
    processingTime: "3-6 weeks",
    phone: "+91 22 6665 8282",
    website: "tatatrusts.org",
  },
  {
    id: "2",
    name: "Indian Cancer Society",
    kind: "NGO",
    kindLabel: "NGO",
    logoIcon: "ribbon",
    logoTone: "rose",
    summary: "Provides financial aid, patient support, counseling and awareness programs.",
    region: "Pan India (Supports Haryana)",
    covers: "Treatment aid, Counseling, Support Services",
    amountLabel: "Financial Support",
    amount: "Up to ₹2,00,000",
    about:
      "The Indian Cancer Society has supported patients since 1951, combining direct financial aid with counselling, transport help and survivor support groups. Its Cancer Cure Fund covers treatment costs for low-income patients.",
    coverage: [
      "Treatment cost support via Cancer Cure Fund",
      "Counselling for patients and families",
      "Transport and stay assistance",
      "Survivor support groups"
    ],
    eligibility: [
      "Confirmed cancer diagnosis",
      "Annual family income below Rs 2,00,000",
      "Treatment at a registered hospital",
      "Application endorsed by the treating oncologist"
    ],
    documents: [
      "Medical diagnosis and treatment plan",
      "Income certificate",
      "Aadhaar card",
      "Hospital estimate",
      "Two passport photographs"
    ],
    howToApply: [
      "Collect the Cancer Cure Fund form from a branch or website",
      "Have the treating oncologist complete the medical section",
      "Attach income and identity proof",
      "Submit at the nearest ICS branch or by post",
      "Track the application with the reference number issued"
    ],
    processingTime: "2-4 weeks",
    phone: "+91 22 2413 9445",
    website: "indiancancersociety.org",
  },
  {
    id: "3",
    name: "Ayushman Bharat (PM-JAY)",
    kind: "Government",
    kindLabel: "Government",
    logoIcon: "shield-checkmark",
    logoTone: "green",
    summary: "Government health insurance scheme covering cancer treatment.",
    region: "Applicable across India",
    covers: "Cashless treatment in empanelled hospitals",
    amountLabel: "Coverage",
    amount: "Up to ₹5,00,000",
    about:
      "Ayushman Bharat PM-JAY is the Government of India's health assurance scheme. Eligible families receive cashless treatment up to Rs 5,00,000 per year at any empanelled public or private hospital, with cancer care among the covered packages.",
    coverage: [
      "Cashless hospitalisation at empanelled hospitals",
      "Chemotherapy, radiation and surgical oncology packages",
      "Pre-hospitalisation diagnostics (3 days)",
      "Post-hospitalisation follow-up (15 days)",
      "Medicines and consumables during admission"
    ],
    eligibility: [
      "Family listed in the SECC 2011 database or a State-added list",
      "Possession of an Ayushman card or verified eligibility",
      "No cap on family size, age or gender",
      "Pre-existing conditions covered from day one"
    ],
    documents: [
      "Ayushman card or PM-JAY e-card",
      "Aadhaar card",
      "Ration card",
      "Registered mobile number for OTP verification"
    ],
    howToApply: [
      "Check eligibility at pmjay.gov.in or call 14555",
      "Visit the Ayushman Mitra desk at an empanelled hospital",
      "Verify identity with Aadhaar and the registered mobile",
      "The hospital raises the treatment pre-authorisation",
      "Treatment proceeds cashless once approved"
    ],
    processingTime: "Same day (pre-authorisation)",
    phone: "14555",
    website: "pmjay.gov.in",
  },
  {
    id: "4",
    name: "Haryana State Cancer Relief Fund",
    kind: "Government",
    kindLabel: "Government",
    logoIcon: "medal",
    logoTone: "amber",
    summary: "Financial assistance for economically weaker cancer patients in Haryana.",
    region: "Haryana",
    covers: "Treatment cost assistance",
    amountLabel: "Financial Support",
    amount: "Up to ₹3,00,000",
    about:
      "The Haryana State Cancer Relief Fund provides direct financial assistance to cancer patients domiciled in Haryana whose families fall below the state income threshold. Applications are processed through the district Civil Surgeon's office.",
    coverage: [
      "Chemotherapy and radiation cost",
      "Surgical treatment",
      "Diagnostic investigations",
      "Supportive medicines"
    ],
    eligibility: [
      "Domiciled in Haryana (residence proof required)",
      "Annual family income below Rs 1,80,000",
      "Treatment at a government or recognised hospital",
      "Diagnosis certified by a government oncologist"
    ],
    documents: [
      "Haryana domicile certificate",
      "Income certificate from the Tehsildar",
      "Diagnosis and treatment estimate",
      "Aadhaar card and ration card",
      "Bank passbook copy"
    ],
    howToApply: [
      "Obtain the form from the district Civil Surgeon's office",
      "Get the medical section certified by a government oncologist",
      "Attach domicile, income and identity proof",
      "Submit to the Civil Surgeon for district-level verification",
      "Sanctioned amount is transferred to the hospital or patient account"
    ],
    processingTime: "4-8 weeks",
    phone: "+91 172 254 0100",
    website: "haryanahealth.nic.in",
  },
  {
    id: "5",
    name: "CanKids...KidsCan",
    kind: "NGO",
    kindLabel: "NGO",
    logoIcon: "happy",
    logoTone: "violet",
    summary: "Supports children with cancer and their families with treatment and care.",
    region: "Pan India",
    covers: "Treatment aid, Accommodation, Nutrition",
    amountLabel: "Financial Support",
    amount: "Varies by Case",
    about:
      "CanKids...KidsCan works exclusively with children affected by cancer and their families, covering not just treatment but the surrounding costs - travel, accommodation near the hospital, nutrition and schooling support.",
    coverage: [
      "Treatment and medicine costs",
      "Accommodation near the treating hospital",
      "Nutrition support during treatment",
      "Travel assistance for the family",
      "Education support for the child"
    ],
    eligibility: [
      "Patient under 19 years of age",
      "Confirmed paediatric cancer diagnosis",
      "Family unable to meet treatment costs",
      "Treatment at a partner paediatric oncology centre"
    ],
    documents: [
      "Child's diagnosis report",
      "Birth certificate or age proof",
      "Family income proof",
      "Parent or guardian's Aadhaar card",
      "Hospital treatment estimate"
    ],
    howToApply: [
      "Contact the CanKids support officer at the treating hospital",
      "Complete the family assessment with the case worker",
      "Submit medical and income documents",
      "A support plan is drawn up covering the treatment period",
      "Assistance continues through the course of treatment"
    ],
    processingTime: "1-3 weeks",
    phone: "+91 11 4260 1200",
    website: "cankidsindia.org",
  },
  {
    id: "6",
    name: "CanSupport",
    kind: "NGO",
    kindLabel: "NGO",
    logoIcon: "heart-circle",
    logoTone: "mint",
    summary: "Home-based palliative care and support for underprivileged cancer patients.",
    region: "Haryana, Delhi NCR",
    covers: "Palliative care, Counseling, Home visits",
    amountLabel: "Support",
    amount: "Free Service",
    about:
      "CanSupport provides free home-based palliative care across Haryana and Delhi NCR. Teams of a doctor, nurse and counsellor visit patients at home, focusing on pain relief, symptom control and family support rather than direct financial aid.",
    coverage: [
      "Home visits by a doctor and nurse",
      "Pain and symptom management",
      "Free palliative medicines",
      "Counselling for patient and family",
      "Bereavement support"
    ],
    eligibility: [
      "Diagnosed cancer patient needing palliative care",
      "Residing within the team's service area",
      "Referral from a treating doctor, or a direct request",
      "No income restriction - the service is free"
    ],
    documents: [
      "Diagnosis report",
      "Current prescription and treatment summary",
      "Address proof for the home visit",
      "Contact number of the primary caregiver"
    ],
    howToApply: [
      "Call the CanSupport helpline to register the patient",
      "Share the diagnosis and current treatment details",
      "A team visits to assess needs at home",
      "A care plan is agreed with the family",
      "Regular home visits begin, free of cost"
    ],
    processingTime: "Within 1 week",
    phone: "+91 11 4126 0715",
    website: "cansupport.org",
  },
  {
    id: "7",
    name: "HelpAge India",
    kind: "NGO",
    kindLabel: "NGO",
    logoIcon: "people-circle",
    logoTone: "amber",
    summary: "Support for elderly cancer patients including treatment and mobility aid.",
    region: "Pan India",
    covers: "Treatment aid, Elder care",
    amountLabel: "Financial Support",
    amount: "Varies by Case",
    about:
      "HelpAge India focuses on elderly patients, who often face cancer alongside limited mobility and no active income. Support covers treatment costs, mobility aids and access to its mobile healthcare units.",
    coverage: [
      "Treatment and medicine costs",
      "Mobility aids and equipment",
      "Mobile healthcare unit visits",
      "Counselling and elder support groups"
    ],
    eligibility: [
      "Patient aged 60 or above",
      "Confirmed cancer diagnosis",
      "Limited or no independent income",
      "Indian citizen with valid photo ID"
    ],
    documents: [
      "Age proof (Aadhaar or pension record)",
      "Diagnosis report",
      "Income or pension statement",
      "Hospital treatment estimate",
      "Recent photograph"
    ],
    howToApply: [
      "Contact the nearest HelpAge India regional office",
      "Complete the elder assistance form with a case worker",
      "Attach age, income and medical documents",
      "Await a home or hospital verification visit",
      "Approved support is disbursed to the hospital"
    ],
    processingTime: "3-5 weeks",
    phone: "1800 180 1253",
    website: "helpageindia.org",
  },
];

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
