import type { IconName } from "../components/ui";
import type { TileTone } from "../theme";

export type AiCategory = {
  id: string;
  label: string;
  icon: IconName;
  tone: TileTone;
  /** Question seeded into the chat when the tile is tapped. */
  prompt: string;
};

/** The eight pastel tiles on the AI Support screen. */
export const aiCategories: AiCategory[] = [
  {
    id: "treatment",
    label: "Treatment\nOptions",
    icon: "clipboard",
    tone: "rose",
    prompt: "What are the common treatment options for breast cancer?",
  },
  {
    id: "financial",
    label: "Financial\nAssistance",
    icon: "cash",
    tone: "green",
    prompt: "Can I get financial help for my treatment?",
  },
  {
    id: "hospitals",
    label: "Find\nHospitals",
    icon: "business",
    tone: "violet",
    prompt: "Which cancer hospitals are near me?",
  },
  {
    id: "groups",
    label: "Support\nGroups",
    icon: "people",
    tone: "sky",
    prompt: "Are there support groups near me?",
  },
  {
    id: "insurance",
    label: "Insurance\nGuidance",
    icon: "document-text",
    tone: "amber",
    prompt: "How do I use my insurance for cancer treatment?",
  },
  {
    id: "emotional",
    label: "Emotional\nSupport",
    icon: "heart",
    tone: "rose",
    prompt: "I am feeling anxious about my diagnosis.",
  },
  {
    id: "nutrition",
    label: "Nutrition\n& Lifestyle",
    icon: "nutrition",
    tone: "mint",
    prompt: "What should I eat during cancer treatment?",
  },
  {
    id: "general",
    label: "General\nQueries",
    icon: "chatbubble-ellipses",
    tone: "violet",
    prompt: "How does this app work?",
  },
];

export const suggestedQuestions = [
  "Side effects of chemotherapy?",
  "Can I get financial help?",
  "Best hospitals near me",
  "Diet during cancer treatment",
  "Support groups near me",
];

export type ChatMessage = {
  id: string;
  from: "user" | "ai";
  text: string;
  time: string;
};

/**
 * Canned replies. Frontend-only prototype: no model is called, the first
 * keyword match wins and everything else falls back to the generic answer.
 */
const CANNED: { match: RegExp; reply: string }[] = [
  {
    match: /treatment option|breast cancer|treatment for/i,
    reply:
      "Common treatment options for breast cancer include:\n\n1. Surgery – to remove the cancerous tissue\n2. Radiation Therapy – to destroy remaining cancer cells\n3. Chemotherapy – to kill cancer cells using medicine\n4. Hormone Therapy – for hormone receptor-positive cancers\n5. Targeted Therapy – for specific types of breast cancer\n6. Immunotherapy – to help your immune system fight cancer\n\nThe best treatment plan depends on the type, stage and your overall health. I recommend consulting a cancer specialist for a personalized plan.",
  },
  {
    match: /chemo|side effect/i,
    reply:
      "Chemotherapy side effects vary by drug and person. Commonly reported ones include tiredness, nausea, hair loss, mouth sores and a higher risk of infection.\n\nMost are manageable — your oncology team can prescribe medicines for nausea and advise on diet. Tell your doctor promptly about fever, bleeding or severe weakness.",
  },
  {
    match: /financial|money|afford|cost|fund/i,
    reply:
      "Several options may reduce your treatment cost:\n\n1. Ayushman Bharat (PM-JAY) – up to ₹5,00,000 cashless cover\n2. Haryana State Cancer Relief Fund – up to ₹3,00,000\n3. Indian Cancer Society – treatment aid and counseling\n4. Tata Trusts Cancer Care – treatment, medicines and surgery\n\nOpen the Assistance tab to see eligibility and apply.",
  },
  {
    match: /hospital|near me|doctor/i,
    reply:
      "Based on your saved location (Kaithal, Haryana - 136027), the nearest options are KCGMC Hospital (2.4 km) and Civil Hospital, Kaithal (12 km). Both are government hospitals empanelled under PM-JAY.\n\nOpen the Hospitals tab for departments, doctors and cost estimates.",
  },
  {
    match: /insurance|policy|claim/i,
    reply:
      "To use insurance for cancer treatment:\n\n1. Confirm the hospital is empanelled with your insurer or PM-JAY\n2. Inform the hospital insurance desk before admission for cashless approval\n3. Keep your policy, ID proof and diagnosis reports ready\n4. For reimbursement, collect all bills, discharge summary and prescriptions\n\nYou can store these in the Documents tab.",
  },
  {
    match: /diet|eat|nutrition|food/i,
    reply:
      "During treatment, aim for small frequent meals that are easy to digest:\n\n1. Protein at every meal – dal, eggs, paneer, curd\n2. Well-cooked vegetables and peeled fruit\n3. Plenty of fluids – water, coconut water, soups\n4. Avoid raw, street and reheated food while your immunity is low\n\nIf you are losing weight, ask your team for a referral to an oncology dietitian.",
  },
  {
    match: /support group|alone|anxious|scared|afraid|depress/i,
    reply:
      "What you are feeling is very common, and you do not have to manage it alone.\n\nCanSupport and the Indian Cancer Society both run counseling and patient support groups that cover Haryana, including home visits. Many patients also find peer groups at their treating hospital helpful.\n\nIf you ever feel unsafe or hopeless, please reach out to your doctor or a crisis helpline right away.",
  },
];

const FALLBACK =
  "I can help you understand treatment options, costs, hospitals, documents and financial assistance available in the app.\n\nFor anything about your own diagnosis or medicines, please confirm with your oncology team — I can help you prepare the questions to ask them.";

export function aiReply(question: string): string {
  const hit = CANNED.find((c) => c.match.test(question));
  return hit ? hit.reply : FALLBACK;
}

export function nowLabel(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}
