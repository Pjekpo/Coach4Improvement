import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import type { CSSProperties } from "react";
import { Fragment } from "react";
import {
  AlertTriangle,
  Activity,
  BadgeCheck,
  BookOpen,
  Check,
  ClipboardCheck,
  Brain,
  CircleDot,
  Droplets,
  Eye,
  FileText,
  Gavel,
  Heart,
  Home,
  Info,
  TestTube as Tube,
  TriangleAlert,
  Smile,
  Shuffle,
  Scale,
  MessageSquare,
  Minus,
  Moon,
  Download,
  Pill,
  Printer,
  Bath,
  RefreshCcw,
  RotateCcw,
  Shield,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Syringe,
  UserCheck,
  Users,
  Utensils,
  X,
  ZapOff,
} from "lucide-react";
import LogoImage from "@/assets/asset-1.png";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/auth/AuthProvider";
import AuthModal from "@/components/AuthModal";

type AuditScore = "yes" | "no" | "na";
type AccessState = "checking" | "signed-out" | "allowed" | "denied" | "error";

const ICONS = {
  AlertTriangle,
  ZapOff,
  RefreshCcw,
  Sunrise,
  Home,
  Smile,
  TriangleAlert,
  Tube,
  Shuffle,
  Scale,
  MessageSquare,
  Bath,
  Activity,
  Utensils,
  Shield,
  Droplets,
  Syringe,
  Pill,
  Gavel,
  UserCheck,
  Moon,
  Users,
  Brain,
  Heart,
} as const;

type IconName = keyof typeof ICONS;

const AUDIT_SECTIONS: {
  id: string;
  title: string;
  icon: IconName;
  iconColor?: string;
  cqc: string;
  guidance: string;
  guidanceBullets?: string[];
  expectedStandard?: string;
  items: string[];
}[] = [
  {
    id: "reviews",
    title: "Care Plan Reviews & Signatures",
    icon: "RefreshCcw",
    iconColor: "#4F46E5",
    cqc: "QS: Monitoring and Improving Outcomes",
    guidance: "NICE NG189: Evidence involving the person/representative. CQC expects regular, meaningful evaluation of effectiveness.",
    guidanceBullets: [
      "CQC Compliance: Auditors must flag repetitive 'No Change' entries as a failure of governance and clinical oversight.",
      "Best Practice: Reviews should read as a monthly narrative - documenting specific medical changes, social highlights, and stability.",
      "NICE SC1: Advocacy and involvement in reviews are mandatory; ensure the resident or their representative has signed the review.",
    ],
    expectedStandard: "Reviews that tell the story of the month and show responsive changes or active clinical oversight.",
    items: [
      "Do monthly reviews provide a meaningful appraisal (medical visits, illnesses) rather than 'No Change' entries?",
      "Are staff fully acknowledging changes in people's needs and not using 'No change or care plan remains the same' narrative?",
      "If 'No change' entries are present, have you spoken to the staff member and provided coaching/reflection?",
      "Is there evidence that risk assessments have been updated following significant events (falls, hospital admissions)?",
      "Does the review explicitly state if planned actions have been met?",
      "Is there documented evidence of the person's involvement in the review process?",
    ],
  },
  {
    id: "communication",
    title: "Catheter Care & Management",
    icon: "Droplets",
    iconColor: "#3b82f6",
    cqc: "CQC Regulation 12: NICE PH36 & QS61",
    guidance: "NICE PH36 & QS61: Evidence of catheter necessity review, CAUTI prevention, and complication management.",
    guidanceBullets: [
      "NICE QS61: Catheters should only be used after considering alternatives and should be reviewed daily for continued need.",
      "Infection Control: Catheter-Associated Urinary Tract Infections (CAUTI) are a major safety risk; documentation must prove 'closed system' maintenance.",
      "Best Practice: Ensure the 'Catheter Passport' or record is updated after every change, including the batch number and expiry date of the new catheter.",
    ],
    expectedStandard:
      "A plan that actively seeks to remove the catheter where possible and provides clear clinical instructions for daily maintenance.",
    items: [
      "Is there a Catheter Risk Assessment that reviews the ongoing medical necessity of the device (to prevent CAUTI)?",
      "Does the plan specify the catheter details: Type, Size, Balloon Vol, and the Date of next scheduled change?",
      "Are daily hygiene requirements and 'Meatus' care clearly documented and being recorded?",
      "Is there a clear management plan for complications (e.g. bypassing, blockage, or suspected infection)?",
    ],
  },
  {
    id: "mobility",
    title: "Communication Needs",
    icon: "MessageSquare",
    iconColor: "#4F46E5",
    cqc: "CQC Accessible Information Standard (AIS): Regulation 9",
    guidance: "Accessible Information Standard: Evidence of communication preferences and support needs.",
    guidanceBullets: [
      "CQC Quality Statement: 'Equity in experiences' requires proactive support for communication barriers.",
      "Call Bell Safety: If a person cannot use a standard call bell, a 'sensor mat', 'pendant', or 'frequent welfare checks' must be documented as the alternative.",
      "Best Practice: Always specify 'preferred language' and 'preferred name'. Avoid generic labels like 'confused'.",
      "NICE NG44: Emphasizes that information must be provided in formats that the individual can actually use and understand.",
    ],
    expectedStandard:
      "A profile that helps staff communicate effectively and ensures the person has a reliable, documented way to call for assistance.",
    items: [
      "Does the care plan explicitly state what the person likes to be called?",
      "Is there a warning against using terms of endearment (e.g., 'love') unless requested?",
      "Is the 'Accessible Information Standard' met (e.g., Large Print, Easy Read)?",
      "Does the plan identify if the person uses aids (hearing aids, Makaton)?",
      "Are 'Non-Verbal' cues described for people who cannot speak?",
      "Does the plan state if the person can use a call bell, and if not, does it detail exactly how they are supported to summon help?",
    ],
  },
  {
    id: "nutrition",
    title: "Continence & Bowel Management",
    icon: "Droplets",
    iconColor: "#3b82f6",
    cqc: "CQC Regulation 12 & 14: NICE CG99",
    guidance: "NICE CG99: Person-centred continence assessments, bowel management, and escalation planning.",
    guidanceBullets: [
      "NICE CG99: Clinical assessment must identify the *type* of incontinence (urge, stress, etc) before choosing products.",
      "CQC Focus: Excessive use of high-absorbency pads without a toileting plan is often viewed as institutional abuse.",
      "Best Practice: Use the Bristol Stool Scale for every entry and set clear 'Day 3' escalation triggers for laxatives.",
    ],
    expectedStandard:
      "A plan promoting independence and using clinical tools like the Bristol Stool Scale accurately.",
    items: [
      "Is the identified need written in a person-centred manner, referring to dignity?",
      "Is there a comprehensive Continence Assessment identifying 'Type'?",
      "Does the plan specify EXACT product type, size, and absorbency?",
      "Is there a 'Bowel Management Plan' using the Bristol Stool Scale?",
      "Does the plan identify a clear 'Escalation Protocol' for constipation?",
    ],
  },
  {
    id: "skin",
    title: "Diabetes Care (Type 1 & Type 2)",
    icon: "Activity",
    iconColor: "#16a34a",
    cqc: "CQC Regulation 12 (Safe Care): NICE NG28",
    guidance: "NICE NG28: Diagnosis detail, glucose targets, insulin management, and foot care.",
    guidanceBullets: [
      "NICE NG28: Blood glucose targets must be individualised; 'one size fits all' ranges (e.g., 4-7) are outdated for elderly patients.",
      "Safe Care: Site rotation maps are required to prevent lipohypertrophy.",
      "Best Practice: Ensure 'Hypo Boxes' are checked monthly and the rescue plan is displayed on a single, clear page.",
    ],
    expectedStandard:
      "A plan that allows staff to act immediately during a hypo and monitors glucose within specific clinical ranges.",
    items: [
      "Diagnosis Detail: Does the care plan clearly specify if the resident has Type 1 or Type 2 Diabetes?",
      "Blood Glucose Monitoring: Are there clear 'Target Ranges' specified by a clinician, with guidance on ketones and responding to hyperglycemia and hypoglycemia?",
      "Insulin Management: If on insulin, does the plan specify the type and site rotation?",
      "Emergency Action Plan: Is there a 'Hypo Rescue Plan' detailing exactly what to give?",
      "Are diabetes annual checks such as Foot Care, eye sight checks and HB1ac checks documented?",
    ],
  },
  {
    id: "continence",
    title: "End of Life & Advance Care Planning",
    icon: "Sunrise",
    iconColor: "#f97316",
    cqc: "CQC Quality Statement: Compassionate End of Life Care; NICE NG142",
    guidance: "NICE NG142: Advance decisions, preferences, and culturally sensitive end-of-life planning.",
    guidanceBullets: [
      "NICE NG142: Care must be based on the person's 'Lasting Power of Attorney' status and documented priorities.",
      "CQC Requirement: DNR (ReSPECT) forms must be the original, signed, and clearly visible for paramedics.",
      "Best Practice: Revisit EoL wishes every 6 months, as priorities often change during health fluctuations.",
    ],
    expectedStandard: "Highly personal plans that ensure dignity and respect for final wishes.",
    items: [
      "Is there an 'Advance Decision to Refuse Treatment' (ADRT) or DNR form present?",
      "Does the plan record the person's wishes regarding their place of death?",
      "Are spiritual, religious, or cultural rites documented?",
      "Is there a 'Preferred Priorities of Care' (PPC) document in the file?",
    ],
  },
  {
    id: "diabetes",
    title: "Epilepsy & Seizure Management",
    icon: "ZapOff",
    iconColor: "#ef4444",
    cqc: "CQC Regulation 12: Safe Care; NICE NG217",
    guidance: "NICE NG217: Individualised seizure management, triggers, and emergency protocols.",
    guidanceBullets: [
      "NICE NG217: Every resident with epilepsy must have a detailed seizure description (aura, movements, post-ictal state).",
      "CQC Safety: Staff must have documented training in 'Rescue Medication' (Midazolam) if it is prescribed.",
      "Best Practice: Use a seizure diary to track frequency and link patterns to medication reviews.",
    ],
    expectedStandard: "A plan that provides specific instructions for rescue meds and post-seizure recovery.",
    items: [
      "Is there a person-specific Epilepsy Care Plan describing unique seizure types?",
      "Does the plan identify known 'Triggers'?",
      "Is there a clear 'Step-by-Step' First Aid guide for staff to follow specifying when to call 999 or emergency services?",
      "Is there an 'Emergency Protocol' (Rescue Meds) specified?",
    ],
  },
  {
    id: "safety",
    title: "Maintaining Safety",
    icon: "Home",
    iconColor: "#4F46E5",
    cqc: "CQC Regulation 12 & 15",
    guidance: "Health and safety checks must be person-specific and tied to the care plan.",
    guidanceBullets: [
      "HSE & CQC: Room assessments must be person-specific (e.g., risk of falling from a specific bed height).",
      "Best Practice: Include sensory adjustments for dementia (e.g., non-patterned carpets, appropriate lighting levels).",
      "Regulatory: Ensure daily/weekly safety checks for equipment (bed rails, call bells) are linked to the care plan.",
    ],
    expectedStandard:
      "Documentation showing how the person's room reflects their choice while managing safety risks.",
    items: [
      "Does the plan reflect the person's 'Homely' choices and personality in the environment?",
      "Is there a specific 'Room Risk Assessment' identifying hazards/safety checks?",
      "Are window restrictors and radiator covers documented as checked, and is there guidance on checking falls sensors (where one is provided) and pressure mattresses?",
      "Does the environment plan reflect specific sensory needs (lighting, noise)?",
    ],
  },
  {
    id: "capacity",
    title: "Mental Capacity & Consent",
    icon: "Scale",
    iconColor: "#4F46E5",
    cqc: "Mental Capacity Act 2005; CQC Regulation 11",
    guidance: "MCA requires decision-specific capacity assessments and documented best interests.",
    guidanceBullets: [
      "MCA Code of Practice: Assessments must be decision-specific. A 'Global' capacity assessment is legally invalid.",
      "CQC Focus: Ensure DoLS recorded mentions (e.g., taking the person out weekly) are actually written into the care plan.",
      "Best Practice: Always document the Least Restrictive options considered before a restrictive decision was made.",
    ],
    expectedStandard:
      "Clear documentation of who makes decisions and evidence of the least restrictive option.",
    items: [
      "Is there evidence of a capacity assessment for specific complex decisions?",
      "Does the MCA Functional Assessment section clearly show what question the person was given and what their actual response was? Does it demonstrate support provided to help them understand and retain information relating to the decision?",
      "Are 'Best Interest Decisions' documented and involve family/advocates? Are actual names of people consulted or involved included (not just family or professionals)?",
      "If the person is deprived of their liberty, is a valid DoLS/LPS authorization in place?",
      "Is there a record of 'Lasting Power of Attorney' (Health & Welfare)?",
    ],
  },
  {
    id: "mobilityTransfers",
    title: "Mobility & Transfers",
    icon: "Shuffle",
    iconColor: "#4F46E5",
    cqc: "LOLER 1998; CQC Regulation 12 & 15",
    guidance: "LOLER: Equipment safety, sling suitability, and documented handling risks.",
    guidanceBullets: [
      "LOLER Regulations: Any equipment mentioned must have a valid 6-monthly service sticker.",
      "Best Practice: Slings are 'Prescribed Items'. They must be sized to the individual, not shared across the unit.",
      "NICE QS86: Emphasizes maintaining independence; the plan should describe what the person 'can' still do (e.g., can weight bear for 10 seconds).",
    ],
    expectedStandard: "A plan that leaves no room for error regarding which sling or hoist to use.",
    items: [
      "Does the care plan specify the exact equipment required (e.g. brand/model of hoist)?",
      "Is the sling type and size explicitly documented?",
      "Does the plan match the 'Moving & Handling' risk assessment?",
      "Is the level of staff assistance (e.g. x1 or x2) clearly stated?",
    ],
  },
  {
    id: "nutritionHydration",
    title: "Nutrition & Hydration",
    icon: "Utensils",
    iconColor: "#f97316",
    cqc: "CQC Regulation 14; NICE QS15",
    guidance: "NICE QS15: Nutritional support, IDDSI compliance, and fluid target monitoring.",
    guidanceBullets: [
      "NICE CG32: Nutritional support must start immediately for high MUST scores (score 2+).",
      "CQC Regulation 14: Fluid targets must be clinical (e.g., 30ml per kg) and not a generic 'plenty of fluids'.",
      "Best Practice: Integrate IDDSI posters into the kitchen/dining area and link them to individual care plans.",
    ],
    expectedStandard:
      "Detailed IDDSI guidance and clear evidence that staff act when targets are not met.",
    items: [
      "Is there a clear 'Daily Fluid Target' documented (e.g., 1600ml), and are fluid/food charts totaled and analyzed for trends daily?",
      "Are food preferences, allergies, and intolerances highlighted?",
      "Does the plan specify required food textures (IDDSI levels)?",
      "If there has been evidence of weight loss, does the care plan demonstrate evidence of referral to dieticians or GP?",
    ],
  },
  {
    id: "oralHealth",
    title: "Oral Health & Dental Care",
    icon: "Smile",
    iconColor: "#ec4899",
    cqc: "CQC Quality Statement: Safe & Effective; NICE NG48",
    guidance: "NICE NG48: Oral health assessments, hygiene routines, and product-specific care.",
    guidanceBullets: [
      "NICE NG48: Oral health must be assessed on admission and reviewed at least quarterly.",
      "CQC 'Smiling Matters': Inadequate mouth care is linked to aspiration pneumonia; documentation must show daily checks.",
      "Best Practice: Name the specific toothbrush type (soft/electric) and toothpaste (ppm fluoride) used.",
    ],
    expectedStandard: "Detailed instructions on denture care and specific preferences for oral hygiene.",
    items: [
      "Is there a specific Oral Health Assessment (e.g., OHAT) completed?",
      "Does the plan specify the frequency of mouth care?",
      "Are specific products named (e.g., high-fluoride toothpaste)?",
      "If the person has dentures, is the cleaning routine documented?",
    ],
  },
  {
    id: "pain",
    title: "Pain Management & Assessment",
    icon: "TriangleAlert",
    iconColor: "#ef4444",
    cqc: "CQC Regulation 12: Safe Care; NICE NG92",
    guidance: "NICE NG92: Pain assessment, dementia-specific observation, and PRN linkage.",
    guidanceBullets: [
      "NICE NG92: Pain management in dementia must rely on observation of behaviour, not just verbal reports.",
      "CQC Safeguarding: Persistent pain is a common trigger for 'distressed behaviour'; look for links between the two plans.",
      "Best Practice: Document non-pharmacological interventions (e.g., positioning, heat packs) before PRN meds.",
    ],
    expectedStandard: "A plan that helps staff identify non-verbal cues for pain and links them to the PRN protocol.",
    items: [
      "Does the care plan document how the person expresses pain?",
      "Is a recognized tool (e.g., Abbey Pain Scale) in use for non-verbal residents?",
      "Is there a clear link between the pain assessment and the 'PRN' protocol?",
      "Is PRN medication evaluated for effectiveness 30-60 minutes after administration?",
    ],
  },
  {
    id: "peg",
    title: "PEG Care & Enteral Nutrition",
    icon: "Tube",
    iconColor: "#6366f1",
    cqc: "CQC Regulation 12: Safe Care; NICE CG32",
    guidance: "NICE CG32: Safe enteral feeding, stoma checks, and emergency protocols.",
    guidanceBullets: [
      "NICE CG32: Detailed flushing protocols (pre/post meds) are essential to prevent blockages.",
      "Safe Care: The stoma site must be checked daily for signs of infection or over-granulation.",
      "Best Practice: Keep a 'PEG Passport' with the resident for hospital transfers, detailing tube specifications.",
    ],
    expectedStandard: "Clear step-by-step instructions for site care and emergency contact numbers.",
    items: [
      "Is there a PEG-specific Risk Assessment in place, this should include infection, blockages, overgranulation, and dislodgement?",
      "Does the plan specify the tube type, size, and insertion date?",
      "Is there guidance on daily stoma site care and evidence that the maintenance is taking place? This includes rotation and advancing the tube?",
      "Is there specific oral hygiene guidance for people with a PEG tube, including mouth care, brushing, and moisturising to prevent dental issues and promote overall oral health?",
      "Is there an 'Emergency Protocol' in place for a displaced tube? Are contact details for specialist professionals available in the care plan?",
    ],
  },
  {
    id: "personalCare",
    title: "Personal Care & Grooming",
    icon: "Bath",
    iconColor: "#ec4899",
    cqc: "CQC Regulation 9: Person-Centred Care",
    guidance: "Person-centred care requires clear grooming preferences and independence support.",
    guidanceBullets: [
      "CQC Quality Statement: Responding to people's immediate needs - care must respect cultural identity and grooming habits.",
      "Best Practice: Make away from 'Needs 1 to assist' toward 'Prefers to wash face independently but needs help with lower body'.",
      "NICE SC1: Emphasizes that personal care should never feel like a 'task' but a shared interaction.",
    ],
    expectedStandard:
      "A plan that allows a new staff member to support a resident exactly as they prefer.",
    items: [
      "Does the plan record the person's preference for bath vs shower?",
      "Are specific grooming preferences (shaving, makeup, hair) documented?",
      "Are cultural/religious requirements for personal care addressed?",
      "Is there guidance on the level of independence the person wishes to maintain?",
    ],
  },
  {
    id: "positiveBehaviour",
    title: "Positive Behaviour Support",
    icon: "Brain",
    iconColor: "#f59e0b",
    cqc: "CQC Regulation 12 / 13",
    guidance:
      "CQC Right Support, Right Care, Right Culture: PBS plans must identify unmet needs and reduce restrictive practice.",
    guidanceBullets: [
      "CQC Right Support, Right Care, Right Culture: Focus on PBS plans that identify unmet needs (pain, hunger, boredom).",
      "Regulatory: Any PRN 'for behaviour' must have a clear protocol and be monitored for overuse.",
      "Best Practice: Use the 'ABC' (Antecedent, Behaviour, Consequence) model to identify and eliminate triggers.",
    ],
    expectedStandard:
      "Staff guidance that focuses on de-escalation through understanding unmet needs.",
    items: [
      "Is the plan written to help staff understand the 'Person' behind the distress?",
      "Are triggers and de-escalation strategies clearly defined?",
      "Is there evidence of 'Least Restrictive Practice' being applied?",
      "Does the plan identify environmental factors that affect behaviour?",
    ],
  },
  {
    id: "riskAssessment",
    title: "Risk Assessment Tools Audit",
    icon: "Shield",
    iconColor: "#ef4444",
    cqc: "CQC Regulation 12 & 17",
    guidance:
      "CQC Quality Statement: Safe systems, pathways and transitions require risks to be shared across the team.",
    guidanceBullets: [
      "CQC Quality Statement: Safe systems, pathways and transitions require risks to be shared across the team.",
      "NICE CG161: Falls prevention must include a multifactorial assessment (vision, footwear, environment, medication).",
      "Best Practice: Dynamic Risk Assessment—staff should be trained to update the plan as soon as a change is noted.",
    ],
    expectedStandard:
      "A high MUST score is immediately followed by a food fortification plan and dietician referral.",
    items: [
      "MUST Tool: Is the assessment complete and followed by action if high risk?",
      "Falls Risk Assessment: Does the care plan include specific prevention strategies?",
      "Choking Risk Assessment: Does the plan reflect recent SALT advice?",
      "Responsiveness: Are risk assessments updated immediately following an incident?",
    ],
  },
  {
    id: "skinIntegrity",
    title: "Skin Integrity & Pressure Care",
    icon: "Heart",
    iconColor: "#10b981",
    cqc: "CQC Regulation 12; NICE CG179; NICE NG19",
    guidance:
      "NICE CG179: Pressure ulcer prevention requires documented repositioning and wound care focus if risk is high.",
    guidanceBullets: [
      "NICE CG179: Pressure ulcer prevention requires a documented 'repositioning schedule' if risk is high.",
      "CQC Focus: Missing daily skin checks is the #1 cause of failure to provide safe care in residential settings.",
      "Best Practice: Include photos (with consent) to show the progression or healing of any skin breaks.",
    ],
    expectedStandard:
      "A comprehensive wound record that shows the 'journey' of the wound with visual evidence.",
    items: [
      "Is there a current Waterlow or Braden risk assessment score recorded?",
      "Does the care plan specify the frequency of repositioning and is there evidence that this is being followed - check the repositioning chart.",
      "Are specific pressure-relieving items (mattresses/cushions) named and set correctly?",
      "Is there a 'Body Map' in use for daily skin checks?",
      "Wound Care Plans: Are they fully completed with wound development history, wound measurements, wound treatment offered at each review and photos?",
    ],
  },
  {
    id: "sleepingSupport",
    title: "Sleeping & Night-Time Support",
    icon: "Moon",
    iconColor: "#6366f1",
    cqc: "CQC Regulation 9 & 12; NICE NG97",
    guidance:
      "Personalization: Plans must specify details like bed times, lighting preferences, and snack routines to support psychological well-being.",
    guidanceBullets: [
      "Personalization: Plans must specify details like bed times, lighting preferences, and snack routines to support psychological well-being.",
      "Safety & Risk: 'Medical conditions affecting night safety' (e.g., nocturnal seizures, heart failure) must have an escalation plan.",
      "Least Restrictive: Equipment like bed rails or pressure mats require a documented Best Interest Decision or explicit consent to avoid 'unlawful restraint'.",
      "Continence: Support for overnight toileting (e.g., commode placement) should balance safety with the promotion of dignity.",
    ],
    expectedStandard:
      "A night profile that allows staff to maintain the person's safety and comfort without unnecessary intrusion, clearly identifying how they summon help.",
    items: [
      "Does the plan specify the person's exact sleep patterns (times) and the specific level of independence/assistance needed at night?",
      "Are environment and routine preferences (pillows, lighting, snacks, staff gender) clearly defined to reduce night-time anxiety?",
      "Is there evidence of risk assessments for all night-time equipment (bed rails, mats) and a clinical rationale for repositioning frequencies?",
      "Are medical risks and emergency communication (call bell position/accessibility) clearly documented for night staff?",
    ],
  },
];

const PERSONAL_INFO_CRITERIA = [
  "Front section contains details such as family and friends important to the person that they wish to stay in contact with.",
  "Basic summary provides information about the person's life, background, and interests. Where possible this should be based on information provided by the person, but also include information from relatives or representatives where appropriate.",
];

function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={className} />;
}

type PostFallFieldValue = string | boolean;

const POST_FALL_INTERVALS = [
  { id: "h1", label: "Hr 1", sub: "1h post" },
  { id: "h2", label: "Hr 2", sub: "2h post" },
  { id: "h3", label: "Hr 3", sub: "3h post" },
  { id: "h4", label: "Hr 4", sub: "4h post" },
  { id: "h6", label: "Hr 6", sub: "6h post", phase: "PHASE 2: 2-HOURLY" },
  { id: "h8", label: "Hr 8", sub: "8h post" },
  { id: "h12", label: "Hr 12", sub: "12h post", phase: "PHASE 3: 4-HOURLY (TO 24 HRS)" },
  { id: "h16", label: "Hr 16", sub: "16h post" },
  { id: "h20", label: "Hr 20", sub: "20h post" },
  { id: "h24", label: "Hr 24", sub: "Completion" },
] as const;

const POST_FALL_PRINT_STYLES = `
  @media print {
    body[data-print-section="care-plan-quality-audit"] #post-fall-monitoring-chart {
      display: none !important;
    }

    body[data-print-section="post-fall-monitoring-chart"] .care-plan-audit-shell {
      display: none !important;
    }

    body[data-print-section="post-fall-monitoring-chart"] #post-fall-monitoring-chart {
      display: block !important;
    }

    body[data-print-section="post-fall-monitoring-chart"] .post-fall-no-print {
      display: none !important;
    }

    body[data-print-section="post-fall-monitoring-chart"] .post-fall-section-card {
      break-inside: avoid;
    }
  }
`;

const POST_FALL_LAYOUT_STYLES = `
  .post-fall-layout {
    display: block;
    max-width: 1152px;
    margin: 0 auto;
  }

  .post-fall-sidebar {
    width: 100%;
    margin-bottom: 24px;
  }

  .post-fall-main {
    min-width: 0;
  }

  @media (min-width: 960px) {
    .post-fall-layout {
      display: grid;
      grid-template-columns: 320px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }

    .post-fall-sidebar {
      width: 320px;
      margin-bottom: 0;
    }
  }
`;

function createInitialPostFallFormState(): Record<string, PostFallFieldValue> {
  const initialState: Record<string, PostFallFieldValue> = {
    res_name: "",
    res_nhs: "",
    res_dob: "",
    fall_time: "",
    risk_avpu: "Alert",
    risk_meds: "No",
    risk_call: "No",
    final_summary: "",
    check_stable: false,
    check_plan: false,
    signer_name: "",
  };

  POST_FALL_INTERVALS.forEach((interval) => {
    initialState[`${interval.id}_time`] = "";
    initialState[`${interval.id}_avpu`] = "";
    initialState[`${interval.id}_pupils`] = "";
    initialState[`${interval.id}_vitals`] = "";
    initialState[`${interval.id}_staff`] = "";
  });

  return initialState;
}

function PostFallMonitoringChart() {
  const initialState = useMemo(() => createInitialPostFallFormState(), []);
  const [formData, setFormData] = useState<Record<string, PostFallFieldValue>>(initialState);

  const isDirty = useMemo(
    () => Object.keys(initialState).some((key) => formData[key] !== initialState[key]),
    [formData, initialState]
  );

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const setField = (field: string, value: PostFallFieldValue) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    const residentName = String(formData.res_name || "").trim();
    const reportTitle = residentName ? `POST-FALL MONITORING CHART - ${residentName}` : "POST-FALL MONITORING CHART";

    const restore = () => {
      document.title = previousTitle;
      document.body.removeAttribute("data-print-section");
      window.removeEventListener("afterprint", restore);
    };

    document.body.setAttribute("data-print-section", "post-fall-monitoring-chart");
    document.title = reportTitle;
    window.addEventListener("afterprint", restore);
    window.print();
    window.setTimeout(restore, 1000);
  };

  const handleDownloadCsv = () => {
    const csvRows = ["Field ID,Value"];
    Object.keys(initialState).forEach((key) => {
      const value = formData[key];
      const csvValue =
        typeof value === "boolean"
          ? String(value)
          : `"${String(value).replace(/"/g, '""')}"`;
      csvRows.push(`${key},${csvValue}`);
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const residentName = String(formData.res_name || "").trim() || "Resident";
    const fileName = `Post_Fall_${residentName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm("DANGER: This will permanently erase all data on this page. Continue?")) {
      setFormData(initialState);
    }
  };

  const inputClassName =
    "mt-1 w-full text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-[#dbe7ff]";

  const toolPrimaryButtonStyle: CSSProperties = {
    display: "flex",
    width: "100%",
    height: "50px",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "5px",
    border: "0",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1,
  };

  const printButtonBaseColor = "#3267dd";
  const printButtonHoverColor = "#214fb8";
  const downloadButtonBaseColor = "#20a747";
  const downloadButtonHoverColor = "#187d36";
  const clearButtonBaseColor = "#f2f2f4";
  const clearButtonHoverColor = "#dfe1e6";

  const toolIconStyle: CSSProperties = {
    width: "18px",
    height: "18px",
    flex: "0 0 auto",
  };

  const postFallSectionHeadingStyle: CSSProperties = {
    margin: 0,
    color: "#234fc7",
    fontSize: "13px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.01em",
  };

  const postFallFieldLabelStyle: CSSProperties = {
    display: "block",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  };

  const postFallFieldStyle: CSSProperties = {
    width: "100%",
    minHeight: "44px",
    borderRadius: "8px",
    border: "1px solid #c5ccd6",
    backgroundColor: "#ffffff",
    padding: "10px 12px",
    fontSize: "16px",
    lineHeight: 1.2,
    boxSizing: "border-box",
  };

  const postFallMainTitleStyle: CSSProperties = {
    margin: 0,
    color: "#000000",
    fontSize: "36px",
    fontWeight: 900,
    lineHeight: 1.05,
    textTransform: "uppercase",
    letterSpacing: "-0.02em",
  };

  const postFallTableHeaderCellStyle: CSSProperties = {
    border: "1px solid #d6dbe1",
    backgroundColor: "#dfe5ef",
    padding: "12px 10px",
    color: "#1e429f",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    textAlign: "left",
  };

  const postFallTablePhaseCellStyle: CSSProperties = {
    border: "1px solid #d6dbe1",
    backgroundColor: "#f7f8fa",
    padding: "8px 10px",
    color: "#000000",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    textAlign: "center",
  };

  const formToolsHeadingStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    margin: "0 0 18px",
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "0",
  };

  const postFallTextareaStyle: CSSProperties = {
    ...postFallFieldStyle,
    minHeight: "96px",
    padding: "12px",
    resize: "vertical",
  };

  const postFallTableInputStyle: CSSProperties = {
    width: "100%",
    minHeight: "32px",
    borderRadius: "6px",
    border: "1px solid #d6dbe1",
    backgroundColor: "#ffffff",
    padding: "4px 8px",
    fontSize: "12px",
    lineHeight: 1.2,
    boxSizing: "border-box",
  };

  return (
    <section
      id="post-fall-monitoring-chart"
      style={{ marginTop: "56px", marginBottom: "32px", backgroundColor: "#e8e8e8", borderRadius: "28px", padding: "18px" }}
    >
      <div className="post-fall-layout">
        <aside
          className="post-fall-no-print post-fall-sidebar"
          style={{ position: "sticky", top: "16px", height: "fit-content", zIndex: 20 }}
        >
          <div
            className="rounded-[14px] bg-white"
            style={{
              borderTop: "4px solid #3267dd",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.12)",
              padding: "18px 14px 18px",
            }}
          >
            <h3 style={formToolsHeadingStyle}>
              <svg
                aria-hidden="true"
                viewBox="0 0 18 18"
                style={{ width: "18px", height: "18px", marginRight: "12px", flex: "0 0 auto" }}
              >
                <line x1="3" y1="1.5" x2="3" y2="16.5" stroke="#1f2937" strokeWidth="1.7" strokeLinecap="round" />
                <line x1="9" y1="1.5" x2="9" y2="16.5" stroke="#1f2937" strokeWidth="1.7" strokeLinecap="round" />
                <line x1="15" y1="1.5" x2="15" y2="16.5" stroke="#1f2937" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="3" cy="6" r="1.9" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
                <circle cx="9" cy="11" r="1.9" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
                <circle cx="15" cy="5" r="1.9" fill="#ffffff" stroke="#1f2937" strokeWidth="1.5" />
              </svg>
              Form Tools
            </h3>
            <div style={{ paddingLeft: "2px", paddingRight: "2px" }}>
              <button
                type="button"
                onClick={handlePrint}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = printButtonHoverColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = printButtonBaseColor;
                }}
                onFocus={(event) => {
                  event.currentTarget.style.backgroundColor = printButtonHoverColor;
                }}
                onBlur={(event) => {
                  event.currentTarget.style.backgroundColor = printButtonBaseColor;
                }}
                style={{
                  ...toolPrimaryButtonStyle,
                  marginBottom: "14px",
                  backgroundColor: printButtonBaseColor,
                  color: "#ffffff",
                  transition: "background-color 160ms ease",
                }}
              >
                <Printer style={toolIconStyle} />
                Print to PDF
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = downloadButtonHoverColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = downloadButtonBaseColor;
                }}
                onFocus={(event) => {
                  event.currentTarget.style.backgroundColor = downloadButtonHoverColor;
                }}
                onBlur={(event) => {
                  event.currentTarget.style.backgroundColor = downloadButtonBaseColor;
                }}
                style={{
                  ...toolPrimaryButtonStyle,
                  marginBottom: "14px",
                  backgroundColor: downloadButtonBaseColor,
                  color: "#ffffff",
                  transition: "background-color 160ms ease",
                }}
              >
                <Download style={toolIconStyle} />
                Download Data
              </button>
              <div style={{ borderTop: "1px solid #e4e7eb", marginTop: "4px", marginBottom: "2px" }} />
              <button
                type="button"
                onClick={handleReset}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = clearButtonHoverColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = clearButtonBaseColor;
                }}
                onFocus={(event) => {
                  event.currentTarget.style.backgroundColor = clearButtonHoverColor;
                }}
                onBlur={(event) => {
                  event.currentTarget.style.backgroundColor = clearButtonBaseColor;
                }}
                style={{
                  display: "block",
                  width: "100%",
                  height: "44px",
                  marginTop: "16px",
                  borderRadius: "5px",
                  border: "0",
                  backgroundColor: clearButtonBaseColor,
                  color: "#5f6671",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: 1,
                  transition: "background-color 160ms ease",
                }}
              >
                Clear All Data
              </button>
            </div>
            <div
              style={{
                marginTop: "30px",
                borderRadius: "6px",
                backgroundColor: "#dfe5ef",
                padding: "14px 14px 13px",
                color: "#2952b8",
                fontSize: "14px",
                lineHeight: 1.55,
              }}
            >
              <strong style={{ fontWeight: 800 }}>Note:</strong> Data is not saved automatically. Download your data or print to PDF before closing this window.
            </div>
          </div>
        </aside>

        <main className="post-fall-main">
          <header
            className="mb-8 rounded-xl bg-white px-6 py-8 text-center shadow-sm"
            style={{ borderBottom: "4px solid #3267dd", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)" }}
          >
            <h1 style={postFallMainTitleStyle}>POST-FALL MONITORING CHART</h1>
            <p className="mt-1 text-[15px] font-medium text-slate-700">24-Hour Observation Record (NICE / CQC Compliant)</p>
          </header>

          <section
            className="post-fall-section-card mb-6 rounded-xl bg-white p-6 shadow-sm"
            style={{ border: "1px solid #d7dadd", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.1)" }}
          >
            <h2 className="mb-4 border-b border-[#d8dde4] pb-2" style={postFallSectionHeadingStyle}>
              1. Resident & Incident Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label style={postFallFieldLabelStyle}>Full Name</label>
                <input
                  type="text"
                  value={String(formData.res_name || "")}
                  onChange={(event) => setField("res_name", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                />
              </div>
              <div>
                <label style={postFallFieldLabelStyle}>NHS Number</label>
                <input
                  type="text"
                  value={String(formData.res_nhs || "")}
                  onChange={(event) => setField("res_nhs", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                />
              </div>
              <div>
                <label style={postFallFieldLabelStyle}>DOB</label>
                <input
                  type="date"
                  value={String(formData.res_dob || "")}
                  onChange={(event) => setField("res_dob", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                />
              </div>
              <div>
                <label style={postFallFieldLabelStyle}>Date/Time Discovered</label>
                <input
                  type="datetime-local"
                  value={String(formData.fall_time || "")}
                  onChange={(event) => setField("fall_time", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                />
              </div>
            </div>
          </section>

          <section
            className="post-fall-section-card mb-6 rounded-xl bg-white p-6 shadow-sm"
            style={{ border: "1px solid #d7dadd", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.1)" }}
          >
            <h2 className="mb-4 border-b border-[#d8dde4] pb-2" style={postFallSectionHeadingStyle}>
              2. Initial Assessment & Risk
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label style={postFallFieldLabelStyle}>Baseline AVPU</label>
                <select
                  value={String(formData.risk_avpu || "Alert")}
                  onChange={(event) => setField("risk_avpu", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                >
                  <option>Alert</option>
                  <option>Voice</option>
                  <option>Pain</option>
                  <option>Unresponsive</option>
                </select>
              </div>
              <div>
                <label style={postFallFieldLabelStyle}>Anticoagulants?</label>
                <select
                  value={String(formData.risk_meds || "No")}
                  onChange={(event) => setField("risk_meds", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (High Risk)</option>
                </select>
              </div>
              <div>
                <label style={postFallFieldLabelStyle}>Emergency Call?</label>
                <select
                  value={String(formData.risk_call || "No")}
                  onChange={(event) => setField("risk_call", event.target.value)}
                  className={inputClassName}
                  style={postFallFieldStyle}
                >
                  <option value="No">No</option>
                  <option value="999">999 Called</option>
                  <option value="111">111 Called</option>
                </select>
              </div>
            </div>
          </section>

          <section className="post-fall-section-card mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#d8dde4] pb-2">
              <h2 style={postFallSectionHeadingStyle}>3. 24-Hour Observation Schedule</h2>
            </div>

            <div
              style={{
                marginBottom: "16px",
                borderLeft: "4px solid #ef4444",
                backgroundColor: "#f9eded",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#c62828",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                ⚠ Escalation Triggers (999):
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#d32f2f",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                Confusion, Vomiting, Unequal Pupils, Seizure, Focal Weakness, Drowsiness.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr>
                    <th style={postFallTableHeaderCellStyle}>Interval</th>
                    <th style={postFallTableHeaderCellStyle}>Due</th>
                    <th style={postFallTableHeaderCellStyle}>AVPU</th>
                    <th style={postFallTableHeaderCellStyle}>Pupils</th>
                    <th style={postFallTableHeaderCellStyle}>Vitals/Pain</th>
                    <th style={postFallTableHeaderCellStyle}>Initials</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={postFallTablePhaseCellStyle}>
                      PHASE 1: HOURLY (FIRST 4 HRS)
                    </td>
                  </tr>
                  {POST_FALL_INTERVALS.map((interval) => (
                    <Fragment key={interval.id}>
                      {interval.phase && (
                        <tr>
                          <td colSpan={6} style={postFallTablePhaseCellStyle}>
                            {interval.phase}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border p-2 font-medium text-slate-700">
                          <div>{interval.label}</div>
                          <div className="text-[10px] text-slate-500">{interval.sub}</div>
                        </td>
                        <td className="border p-1">
                          <input
                            type="time"
                            value={String(formData[`${interval.id}_time`] || "")}
                            onChange={(event) => setField(`${interval.id}_time`, event.target.value)}
                            style={postFallTableInputStyle}
                          />
                        </td>
                        <td className="border p-1">
                          <input
                            type="text"
                            value={String(formData[`${interval.id}_avpu`] || "")}
                            onChange={(event) => setField(`${interval.id}_avpu`, event.target.value)}
                            placeholder="A/V/P/U"
                            style={postFallTableInputStyle}
                          />
                        </td>
                        <td className="border p-1">
                          <input
                            type="text"
                            value={String(formData[`${interval.id}_pupils`] || "")}
                            onChange={(event) => setField(`${interval.id}_pupils`, event.target.value)}
                            placeholder="L/R size"
                            style={postFallTableInputStyle}
                          />
                        </td>
                        <td className="border p-1">
                          <input
                            type="text"
                            value={String(formData[`${interval.id}_vitals`] || "")}
                            onChange={(event) => setField(`${interval.id}_vitals`, event.target.value)}
                            style={postFallTableInputStyle}
                          />
                        </td>
                        <td className="border p-1">
                          <input
                            type="text"
                            value={String(formData[`${interval.id}_staff`] || "")}
                            onChange={(event) => setField(`${interval.id}_staff`, event.target.value.toUpperCase())}
                            className="uppercase"
                            style={postFallTableInputStyle}
                          />
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="post-fall-section-card rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b border-[#d8dde4] pb-2" style={postFallSectionHeadingStyle}>
              4. Final Sign-Off (24hr Completion)
            </h2>
            <div className="space-y-4">
              <div>
                <label style={postFallFieldLabelStyle}>Summary & Behavioural Changes</label>
                <textarea
                  rows={3}
                  value={String(formData.final_summary || "")}
                  onChange={(event) => setField("final_summary", event.target.value)}
                  className={inputClassName}
                  style={postFallTextareaStyle}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-md border bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase text-slate-700">Checklist:</p>
                  <div className="space-y-1 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.check_stable)}
                        onChange={(event) => setField("check_stable", event.target.checked)}
                      />
                      <span>Neurologically Stable</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.check_plan)}
                        onChange={(event) => setField("check_plan", event.target.checked)}
                      />
                      <span>Care Plan Updated</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <label style={postFallFieldLabelStyle}>Manager/Lead Nurse Sign-off</label>
                  <div className="mt-2 h-10 border-b border-slate-400" />
                  <input
                    type="text"
                    placeholder="Print Name"
                    value={String(formData.signer_name || "")}
                    onChange={(event) => setField("signer_name", event.target.value)}
                    className="italic shadow-none focus:ring-0"
                    style={{ ...postFallFieldStyle, marginTop: "10px", border: "0", paddingLeft: "0", paddingRight: "0", borderRadius: "0", backgroundColor: "transparent" }}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export function ResourcesPage() {
  const [scores, setScores] = useState<Record<string, AuditScore | undefined>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const today = new Date().toISOString().split("T")[0];
  const [meta, setMeta] = useState({ auditor: "", serviceUser: "", date: today });
  const [openGuidance, setOpenGuidance] = useState<Record<string, boolean>>({});
  const [openAuditSections, setOpenAuditSections] = useState<Record<string, boolean>>({});
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [accessMessage, setAccessMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const exportBaseColor = "#4F46E5";
  const exportHoverColor = "#4338ca";
  const clearBaseColor = "#303a4b";
  const clearHoverColor = "#3a465a";

  const handleScore = (key: string, val: AuditScore) => setScores((prev) => ({ ...prev, [key]: val }));
  const clearSection = (sectionId: string) => {
    setScores((prev) => {
      const next = { ...prev };
      const prefix = `${sectionId}-`;
      Object.keys(next).forEach((key) => {
        if (key.startsWith(prefix)) delete next[key];
      });
      return next;
    });
    setComments((prev) => {
      if (!(sectionId in prev)) return prev;
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };
  const toggleGuidance = (sectionId: string) => {
    setOpenGuidance((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  const toggleAuditSection = (sectionId: string) => {
    setOpenAuditSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  const handleExport = () => {
    const prevTitle = document.title;
    const reportTitle = meta.serviceUser ? `Care Plan Audit - ${meta.serviceUser}` : "Care Plan Audit";
    const dateSuffix = meta.date ? ` - ${meta.date}` : "";
    const restoreTitle = () => {
      document.title = prevTitle;
      document.body.removeAttribute("data-print-section");
      window.removeEventListener("afterprint", restoreTitle);
    };

    document.body.setAttribute("data-print-section", "care-plan-quality-audit");
    document.title = `${reportTitle}${dateSuffix}`;
    window.addEventListener("afterprint", restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1000);
  };

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setAccessState("error");
      setAccessMessage("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    if (!user) {
      setAccessState("signed-out");
      setAccessMessage(null);
      return;
    }

    let active = true;
    setAccessState("checking");
    setAccessMessage(null);

    (async () => {
      const filters: string[] = [];
      if (user.id) filters.push(`user_id.eq.${user.id}`);
      if (user.email) filters.push(`email.eq.${user.email}`);
      if (!filters.length) {
        if (active) setAccessState("denied");
        return;
      }

      const { data, error } = await supabase
        .from("allowed_users")
        .select("id, allowed")
        .eq("allowed", true)
        .or(filters.join(","))
        .limit(1)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setAccessState("error");
        setAccessMessage("Unable to verify access. Please contact support.");
        return;
      }

      setAccessState(data ? "allowed" : "denied");
    })();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (accessState === "allowed") {
      setAuthModalOpen(false);
    }
  }, [accessState]);

  const stats = useMemo(() => {
    let met = 0;
    let total = 0;
    const fails: { section: string; item: string; guidance: string }[] = [];
    AUDIT_SECTIONS.forEach((section) => {
      section.items.forEach((item, i) => {
        const key = `${section.id}-${i}`;
        if (scores[key] && scores[key] !== "na") {
          total++;
          if (scores[key] === "yes") {
            met++;
          } else {
            fails.push({ section: section.title, item, guidance: section.guidance });
          }
        }
      });
    });
    return { percent: total ? Math.round((met / total) * 100) : 0, met, total, fails };
  }, [scores]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eef3fb" }}>
      <Helmet>
        <title>Resources | PCS Audit Toolkit</title>
        <meta
          name="description"
          content="Comprehensive PCS audit form for care providers covering CQC and NICE aligned checks across care planning, safety, and governance."
        />
        <link rel="canonical" href="https://coach4improvement.co.uk/resources" />
        <style>{`${POST_FALL_PRINT_STYLES}\n${POST_FALL_LAYOUT_STYLES}`}</style>
      </Helmet>
      <div className="relative max-w-6xl mx-auto p-4 md:py-12">
        {accessState !== "allowed" && (
          <div
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.25)",
            }}
          >
            <div style={{ textAlign: "center", color: "#f8fafc" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.02em" }}>Access required</div>
            </div>

            {accessState === "checking" && (
              <div style={{ color: "#cbd5f5", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
                Checking access...
              </div>
            )}

            {accessState === "error" && (
              <div style={{ color: "#fca5a5", fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
                {accessMessage ?? "Access verification failed."}
              </div>
            )}

            {accessState === "signed-out" && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  style={{
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    borderRadius: "999px",
                    padding: "12px 20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    cursor: "pointer",
                  }}
                >
                  Sign in or create account
                </button>
              </div>
            )}

            {accessState === "denied" && (
              <div style={{ display: "grid", gap: "10px", marginTop: "16px", textAlign: "center" }}>
                <div style={{ color: "#fca5a5", fontSize: "14px", fontWeight: 700 }}>Access denied.</div>
                <div style={{ color: "#cbd5f5", fontSize: "13px" }}>
                  Your account does not have permission to view this page. Contact support to request access.
                </div>
              </div>
            )}

            <div style={{ marginTop: "12px", textAlign: "center", color: "#cbd5f5", fontSize: "12px" }}>
              Need access? Email <strong>coach4improvement@gmail.com</strong> to be added.
            </div>
            <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab="login" />
          </div>
        )}
        <div
          style={{
            filter: accessState === "allowed" ? "none" : "blur(6px)",
            pointerEvents: accessState === "allowed" ? "auto" : "none",
          }}
        >
          <div className="care-plan-audit-shell">
          <div
            className="mb-8 overflow-hidden shadow-lg"
            style={{ borderColor: "transparent", borderRadius: "24px" }}
          >
            <div
              className="px-6 sm:px-8 py-8 flex flex-col gap-7"
              style={{ backgroundColor: "#1E293A", paddingTop: "32px", paddingBottom: "32px", rowGap: "24px" }}
            >
              <div
                className="gap-6"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                  columnGap: "24px",
                }}
              >
                <div className="flex items-center gap-5" style={{ flex: "1 1 auto", minWidth: 0, columnGap: "20px" }}>
                  <div className="bg-white shadow-md rounded-2xl p-3 border border-slate-100">
                    <img
                      src={LogoImage}
                      alt="Coach4Improvement"
                      className="w-14 h-14 object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-3">
                    <h1
                      className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white"
                      style={{ color: "#ffffff", fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
                    >
                      Care Plan Quality Audit
                    </h1>
                    <div
                      className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]"
                      style={{ color: "#9aa6b8" }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-[#22c55e]" /> CQC Quality
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#7c8cff]" /> Clinical Standards
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 print:hidden" style={{ flex: "0 0 auto", marginLeft: "auto", columnGap: "16px" }} />
              </div>
            </div>

            <div
              className="px-6 sm:px-8 py-7"
              style={{ backgroundColor: "#f8fafc", paddingTop: "28px", paddingBottom: "28px" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ columnGap: "24px", rowGap: "20px" }}>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#6b7280" }}>
                    Service User Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none ring-0 transition focus:border-[#c8d0ff] focus:ring-2 focus:ring-[#e3e8ff]"
                    placeholder="Enter service user"
                    value={meta.serviceUser}
                    onChange={(e) => setMeta({ ...meta, serviceUser: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#6b7280" }}>
                    Auditor Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none ring-0 transition focus:border-[#c8d0ff] focus:ring-2 focus:ring-[#e3e8ff]"
                    placeholder="Enter auditor name"
                    value={meta.auditor}
                    onChange={(e) => setMeta({ ...meta, auditor: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#6b7280" }}>
                    Audit Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none ring-0 transition focus:border-[#c8d0ff] focus:ring-2 focus:ring-[#e3e8ff]"
                    value={meta.date}
                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" style={{ marginBottom: "40px" }}>
            <h2
              className="mb-4"
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#1a2234",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                lineHeight: 1.25,
                margin: 0,
                marginBottom: "16px",
              }}
            >
              Introduction: The Aim of Care Planning
            </h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <span
                style={{
                backgroundColor: "#e3e8ff",
                border: "1px solid #c8d0ff",
                color: "#3c4fb4",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 800,
                borderRadius: "8px",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              Regulation 9: Person-Centred Care
            </span>
            <span
              style={{
                backgroundColor: "#d5f2e3",
                border: "1px solid #b4e5cc",
                color: "#0c6b4a",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 800,
                borderRadius: "8px",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              Regulation 12: Safe Care
            </span>
            <span
              style={{
                backgroundColor: "#f9d9dc",
                border: "1px solid #f4b8c0",
                color: "#bf2037",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 800,
                borderRadius: "8px",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              Regulation 17: Governance
            </span>
          </div>
          <div className="space-y-4" style={{ color: "#1e2b3a", lineHeight: 1.6 }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e2b3a",
                borderBottom: "2px solid #cbd5e1",
                paddingBottom: "4px",
                display: "inline-block",
              }}
            >
              Clinical Governance &amp; Compliance
            </div>
            <p style={{ fontSize: "18px", fontWeight: 500, color: "#1e2b3a", margin: 0 }}>
              This audit tool is designed to move beyond simple ‘tick-box’ exercises. By aligning with{" "}
              <span style={{ fontWeight: 800 }}>NICE Guidelines</span> and the <span style={{ fontWeight: 800 }}>CQC Single Assessment Framework</span>, it
              ensures that your documentation provides a defensible, evidence-based record of the care provided.
            </p>
            <p
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                color: "#4b5563",
                margin: 0,
                paddingLeft: "8px",
                borderLeft: "2px solid #cbd5e1",
              }}
            >
              Note: If a section is marked ‘No’, a corresponding SMART action will be generated automatically at the end of this report.
            </p>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e2b3a",
                borderBottom: "2px solid #cbd5e1",
                paddingBottom: "4px",
                display: "inline-block",
              }}
            >
              Personal Information
            </div>
            <div
              className="mt-6 text-[10px] font-semibold uppercase"
              style={{
                color: "#8f9bb0",
                letterSpacing: "0.24em",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "10px",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 52px 52px 52px",
                alignItems: "center",
              }}
            >
              <span>Criteria</span>
              <span style={{ textAlign: "center" }}>Met</span>
              <span style={{ textAlign: "center" }}>No</span>
              <span style={{ textAlign: "center" }}>N/A</span>
            </div>
            <div style={{ borderTop: "1px solid #eef2f7" }}>
              <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
                {PERSONAL_INFO_CRITERIA.map((item, i) => {
                  const key = `personal-info-${i}`;
                  const state = scores[key];
                  return (
                    <div
                      key={key}
                      className="py-4"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#f8fafc" : "#ffffff",
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 52px 52px 52px",
                        alignItems: "center",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                      }}
                    >
                      <p className="text-[14px] font-semibold leading-relaxed" style={{ color: "#2f3b52", margin: 0 }}>
                        {item}
                      </p>
                      {(["yes", "no", "na"] as AuditScore[]).map((val) => {
                        const isActive = state === val;
                        const baseClass = "h-8 w-8 rounded-full border flex items-center justify-center transition-colors";
                        const textColor = isActive
                          ? val === "yes"
                            ? "#16a34a"
                            : val === "no"
                            ? "#e11d48"
                            : "#94a3b8"
                          : "#e6edf6";
                        const borderColor = isActive
                          ? val === "yes"
                            ? "#c7ead7"
                            : val === "no"
                            ? "#f6c9d3"
                            : "#e2e8f0"
                          : "#e6edf6";
                        const bgColor = isActive
                          ? val === "yes"
                            ? "#f0fdf4"
                            : val === "no"
                            ? "#fff1f2"
                            : "#f8fafc"
                          : "#ffffff";
                        return (
                          <div key={val} style={{ display: "flex", justifyContent: "center" }}>
                            <button
                              onClick={() => handleScore(key, val)}
                              className={baseClass}
                              style={{ borderColor, backgroundColor: bgColor, color: textColor }}
                            >
                              {val === "yes" ? (
                                <Check className="h-4 w-4" />
                              ) : val === "no" ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {AUDIT_SECTIONS.map((section) => (
            <section
              key={section.id}
              className="bg-white shadow-sm overflow-hidden"
              style={{ borderRadius: "18px", border: "1px solid #eef2f7", fontFamily: '"Poppins", "Segoe UI", sans-serif', position: "relative" }}
            >
              {(() => {
                const isExpanded = Boolean(openAuditSections[section.id]);
                const isGuidanceOpen = Boolean(openGuidance[section.id]);

                return (
                  <>
                    <div className="px-6 pt-6 pb-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div
                            className="flex items-center justify-center"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: section.iconColor || "#4F46E5",
                              width: "28px",
                              height: "28px",
                            }}
                          >
                            {section.id === "reviews" ? (
                              <ClipboardCheck className="w-6 h-6" />
                            ) : (
                              <Icon name={section.icon} className="w-6 h-6" />
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h2
                              className="text-[15px] font-black tracking-[0.02em]"
                              style={{ color: "#1f2a3a", margin: 0, textTransform: "uppercase" }}
                            >
                              {section.id === "reviews" ? "Care Plan Reviews & 'No Change' Audit" : section.title}
                            </h2>
                            <p
                              className="text-[8px] font-semibold uppercase"
                              style={{
                                color: "#4F46E5",
                                letterSpacing: "0.04em",
                                marginTop: "4px",
                                fontFamily: "\"Times New Roman\", Times, serif",
                              }}
                            >
                              {section.id === "reviews" ? "CQC Regulation 17 (Good Governance)" : section.cqc}
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
                          {isExpanded && (
                            <button
                              type="button"
                              onClick={() => toggleGuidance(section.id)}
                              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase"
                              style={{
                                backgroundColor: "#f3f6fb",
                                color: "#7b8798",
                                letterSpacing: "0.18em",
                                border: "1px solid #e7edf5",
                              }}
                            >
                              <Info className="h-4 w-4" style={{ color: "#94a3b8" }} />
                              {isGuidanceOpen ? "Hide Clinical Guidance" : "View Clinical Guidance"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleAuditSection(section.id)}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase"
                            style={{
                              backgroundColor: isExpanded ? "#1f2a3a" : "#edf2ff",
                              color: isExpanded ? "#ffffff" : "#4F46E5",
                              letterSpacing: "0.18em",
                              border: isExpanded ? "1px solid #1f2a3a" : "1px solid #d6ddff",
                            }}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {isExpanded ? "Collapse Section" : "Open Section"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <>
                {isGuidanceOpen && (
                  <div
                    className="mx-6 rounded-2xl border p-6"
                    style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc", fontFamily: "\"Times New Roman\", Times, serif" }}
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <div
                          className="flex items-center gap-2 text-[10px] font-semibold uppercase"
                          style={{ color: "#4F46E5", letterSpacing: "0.24em" }}
                        >
                          <CircleDot className="h-4 w-4" />
                          Compliance & Best Practice
                        </div>
                        <ul className="space-y-2 text-[13px] font-medium" style={{ color: "#334155" }}>
                          {(section.guidanceBullets?.length ? section.guidanceBullets : [section.guidance]).map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span
                                className="mt-[7px] h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: "#6b7cff", flex: "0 0 auto" }}
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div
                          className="flex items-center gap-2 text-[10px] font-semibold uppercase"
                          style={{ color: "#0f766e", letterSpacing: "0.24em" }}
                        >
                          <Eye className="h-4 w-4" />
                          Expected Standard
                        </div>
                        <div
                          className="rounded-xl border px-4 py-3 text-[13px] italic"
                          style={{ borderColor: "#e2e8f0", color: "#475569", backgroundColor: "#ffffff" }}
                        >
                          "{section.expectedStandard || section.guidance}"
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="mx-6 mt-6 text-[10px] font-semibold uppercase"
                  style={{
                    color: "#8f9bb0",
                    letterSpacing: "0.24em",
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "10px",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 52px 52px 52px",
                    alignItems: "center",
                  }}
                >
                  <span>Criteria</span>
                  <span style={{ textAlign: "center" }}>Met</span>
                  <span style={{ textAlign: "center" }}>No</span>
                  <span style={{ textAlign: "center" }}>N/A</span>
                </div>
              <div style={{ borderTop: "1px solid #eef2f7", marginTop: "12px" }}>
                <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
                  {section.items.map((item, i) => {
                    const key = `${section.id}-${i}`;
                    const state = scores[key];
                    return (
                      <div
                        key={key}
                        className="px-6 py-4"
                        style={{
                          backgroundColor: i % 2 === 0 ? "#f8fafc" : "#ffffff",
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) 52px 52px 52px",
                          alignItems: "center",
                        }}
                      >
                        <p className="text-[14px] font-semibold leading-relaxed" style={{ color: "#2f3b52", margin: 0 }}>
                          {item}
                        </p>
                        {(["yes", "no", "na"] as AuditScore[]).map((val) => {
                          const isActive = state === val;
                          const baseClass = "h-8 w-8 rounded-full border flex items-center justify-center transition-colors";
                          const textColor = isActive
                            ? val === "yes"
                              ? "#16a34a"
                              : val === "no"
                              ? "#e11d48"
                              : "#94a3b8"
                            : "#e6edf6";
                          const borderColor = isActive
                            ? val === "yes"
                              ? "#c7ead7"
                              : val === "no"
                              ? "#f6c9d3"
                              : "#e2e8f0"
                            : "#e6edf6";
                          const bgColor = isActive
                            ? val === "yes"
                              ? "#f0fdf4"
                              : val === "no"
                              ? "#fff1f2"
                              : "#f8fafc"
                            : "#ffffff";
                          return (
                            <div key={val} style={{ display: "flex", justifyContent: "center" }}>
                              <button
                                onClick={() => handleScore(key, val)}
                                className={baseClass}
                                style={{ borderColor, backgroundColor: bgColor, color: textColor }}
                              >
                                {val === "yes" ? (
                                  <Check className="h-4 w-4" />
                                ) : val === "no" ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="px-6 pt-6 pb-5" style={{ borderTop: "1px solid #eef2f7", marginTop: "16px" }}>
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-2 text-[10px] font-semibold uppercase"
                    style={{ color: "#8f9bb0", letterSpacing: "0.22em" }}
                  >
                    <FileText className="h-4 w-4" />
                    Auditor Comments & Evidence Observed
                  </div>
                  <button
                    type="button"
                    onClick={() => clearSection(section.id)}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor = clearHoverColor;
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = clearBaseColor;
                    }}
                    onFocus={(event) => {
                      event.currentTarget.style.backgroundColor = clearHoverColor;
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.backgroundColor = clearBaseColor;
                    }}
                    style={{
                      backgroundColor: clearBaseColor,
                      color: "#ffffff",
                      borderRadius: "999px",
                      padding: "6px 14px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      height: "30px",
                      lineHeight: "1",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 6px 14px rgba(15, 23, 42, 0.2)",
                      flex: "0 0 auto",
                    }}
                    className="inline-flex items-center gap-2 transition"
                  >
                    <RotateCcw className="h-4 w-4" /> Clear
                  </button>
                </div>
                <textarea
                  rows={3}
                  className="mt-4 w-full rounded-2xl border px-5 py-4 text-sm shadow-sm outline-none ring-0 transition focus:ring-2"
                  style={{ borderColor: "#e5edf5", color: "#475569" }}
                  placeholder="e.g. 'Observed MUST score of 3 but no referral made to dietician...'"
                  value={comments[section.id] ?? ""}
                  onChange={(event) =>
                    setComments((prev) => ({ ...prev, [section.id]: event.target.value }))
                  }
                />
              </div>
                      </>
                    )}
                  </>
                );
              })()}
            </section>
          ))}
        </div>
        <div style={{ marginTop: "48px" }}>
          <section
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid #0B1220",
              boxShadow: "0 18px 36px rgba(2, 6, 23, 0.35)",
            }}
          >
            <div style={{ height: "4px", backgroundColor: "#5049E2" }} />
            <div
              style={{
                backgroundColor: "#0F1729",
                padding: "18px 24px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ClipboardCheck className="h-5 w-5" style={{ color: "#F23D60" }} />
                <h2
                  style={{
                    margin: 0,
                    color: "#FFFFFF",
                    fontSize: "16px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Smart Action Plan
                </h2>
              </div>
              <button
                type="button"
                onClick={handleExport}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = exportHoverColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = exportBaseColor;
                }}
                onFocus={(event) => {
                  event.currentTarget.style.backgroundColor = exportHoverColor;
                }}
                onBlur={(event) => {
                  event.currentTarget.style.backgroundColor = exportBaseColor;
                }}
                style={{
                  backgroundColor: exportBaseColor,
                  color: "#ffffff",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  height: "34px",
                  lineHeight: "1",
                  boxShadow: "0 6px 14px rgba(79, 70, 229, 0.25)",
                }}
                className="inline-flex items-center gap-2 transition print:hidden"
              >
                <Printer className="h-4 w-4" /> Export Report
              </button>
            </div>
            <div style={{ backgroundColor: "#0F1729", padding: "0 24px 24px" }}>
              <div
                style={{
                  backgroundColor: "#121A2D",
                  border: "1px dashed #2E3B4D",
                  borderRadius: "14px",
                  padding: "22px 16px",
                  textAlign: "center",
                  color: "#64748A",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                {stats.fails.length > 0 ? "Actions required based on failed criteria" : "Full compliance achieved"}
              </div>
              {stats.fails.length > 0 && (
                <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
                  {stats.fails.map((fail, i) => (
                    <div
                      key={`${fail.section}-${i}`}
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #1E293A",
                        backgroundColor: "#0F1729",
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ fontSize: "9px", fontWeight: 800, color: "#F23D60", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                          {fail.section}
                        </span>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", fontWeight: 700, color: "#E5E7EB" }}>{fail.item}</p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="Corrective Action"
                          style={{
                            backgroundColor: "#121A2D",
                            border: "1px solid #2E3B4D",
                            borderRadius: "8px",
                            padding: "6px 8px",
                            fontSize: "10px",
                            color: "#E5E7EB",
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Assigned To"
                          style={{
                            backgroundColor: "#121A2D",
                            border: "1px solid #2E3B4D",
                            borderRadius: "8px",
                            padding: "6px 8px",
                            fontSize: "10px",
                            color: "#E5E7EB",
                          }}
                        />
                        <input
                          type="date"
                          style={{
                            backgroundColor: "#121A2D",
                            border: "1px solid #2E3B4D",
                            borderRadius: "8px",
                            padding: "6px 8px",
                            fontSize: "10px",
                            color: "#C7CED8",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                backgroundColor: "#020617",
                padding: "22px 24px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 800, textTransform: "uppercase" }}>
                  Audit Score
                </div>
                <div style={{ color: "#9D9EA5", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", marginTop: "2px" }}>
                  Total clinical compliance rating
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#3CD39A", fontSize: "34px", fontWeight: 800 }}>{stats.percent}%</div>
                  <div style={{ color: "#475568", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em" }}>
                    Compliance
                  </div>
                </div>
                <div style={{ width: "1px", height: "46px", backgroundColor: "#1E293A" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#828DF5", fontSize: "34px", fontWeight: 800 }}>
                    {stats.met}/{stats.total}
                  </div>
                  <div style={{ color: "#475568", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em" }}>
                    Passed/Total
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
        <PostFallMonitoringChart />
      </div>
    </div>
  </div>
  );
}

export default ResourcesPage;

