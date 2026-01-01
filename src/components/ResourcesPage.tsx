import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
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
  Pill,
  Printer,
  Bath,
  RefreshCcw,
  RotateCcw,
  Shield,
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
      "Is there evidence that staff are repeatedly using 'No change, No change' in documentation?",
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
      "Blood Glucose Monitoring: Are there clear 'Target Ranges' specified by a clinician?",
      "Insulin Management: If on insulin, does the plan specify the type and site rotation?",
      "Emergency Action Plan: Is there a 'Hypo Rescue Plan' detailing exactly what to give?",
      "Foot Care: Is there a specific Diabetes Foot Risk Assessment documented?",
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
      "Is there a clear 'Step-by-Step' First Aid guide for staff to follow?",
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
      "Are window restrictors and radiator covers documented as checked?",
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
      "Are 'Best Interest Decisions' documented and involve family/advocates?",
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
      "Is there a clear 'Daily Fluid Target' documented (e.g., 1600ml)?",
      "Are food preferences, allergies, and intolerances highlighted?",
      "Does the plan specify required food textures (IDDSI levels)?",
      "Are fluid/food charts being totaled and analyzed for trends daily?",
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
      "Is there a PEG-specific Risk Assessment in place?",
      "Does the plan specify the tube type, size, and insertion date?",
      "Is there guidance on daily stoma site care?",
      "Is there an 'Emergency Protocol' in place for a displaced tube?",
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
      "Does the care plan specify the frequency of repositioning?",
      "Are specific pressure-relieving items (mattresses/cushions) named and set correctly?",
      "Is there a 'Body Map' in use for daily skin checks?",
      "Wound Care Plans: Are they fully completed with measurements and photos?",
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

function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={className} />;
}

export function ResourcesPage() {
  const [scores, setScores] = useState<Record<string, AuditScore | undefined>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const today = new Date().toISOString().split("T")[0];
  const [meta, setMeta] = useState({ auditor: "", serviceUser: "", date: today });
  const [openGuidance, setOpenGuidance] = useState<Record<string, boolean>>({});
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [accessMessage, setAccessMessage] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const { user, signInWithEmail, signInWithGoogle, signOut } = useAuth();
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
  const handleExport = () => {
    const prevTitle = document.title;
    const reportTitle = meta.serviceUser ? `Care Plan Audit - ${meta.serviceUser}` : "Care Plan Audit";
    const dateSuffix = meta.date ? ` - ${meta.date}` : "";
    const restoreTitle = () => {
      document.title = prevTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };

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

  const handleEmailSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setAccessMessage(null);
    setSigningIn(true);
    try {
      await signInWithEmail(emailInput.trim(), passwordInput);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Sign-in failed.";
      setAccessMessage(msg);
    } finally {
      setSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAccessMessage(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to start Google sign-in.";
      setAccessMessage(msg);
    } finally {
      setSigningIn(false);
    }
  };

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
      </Helmet>
      <div className="relative max-w-6xl mx-auto p-4 md:py-12">
        <div
          style={{
            filter: accessState === "allowed" ? "none" : "blur(6px)",
            pointerEvents: accessState === "allowed" ? "auto" : "none",
            transition: "filter 0.2s ease",
          }}
        >
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
          </div>
        </section>

        <div className="space-y-6">
          {AUDIT_SECTIONS.map((section) => (
            <section
              key={section.id}
              className="bg-white shadow-sm overflow-hidden"
              style={{ borderRadius: "18px", border: "1px solid #eef2f7", fontFamily: '"Poppins", "Segoe UI", sans-serif', position: "relative" }}
            >
              <div className="px-6 pt-6 pb-4">
                {(() => {
                  const isOpen = Boolean(openGuidance[section.id]);
                  return (
                    <button
                      type="button"
                      onClick={() => toggleGuidance(section.id)}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: "#f3f6fb",
                        color: "#7b8798",
                        letterSpacing: "0.18em",
                        border: "1px solid #e7edf5",
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        zIndex: 2,
                      }}
                    >
                      <Info className="h-4 w-4" style={{ color: "#94a3b8" }} />
                      {isOpen ? "Hide Clinical Guidance" : "View Clinical Guidance"}
                    </button>
                  );
                })()}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
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
                </div>
                {openGuidance[section.id] && (
                  <div
                    className="mt-5 rounded-2xl border p-6"
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
              </div>
              <div style={{ borderTop: "1px solid #eef2f7" }}>
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
        {accessState !== "allowed" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: "min(520px, 100%)",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
                Resource Access
              </h2>
              <p style={{ margin: "6px 0 16px", color: "#475569" }}>
                Sign in to view the resources audit toolkit.
              </p>

              {accessState === "checking" && (
                <div style={{ color: "#475569", fontSize: "14px" }}>Checking access...</div>
              )}

              {accessState === "error" && (
                <div style={{ color: "#b91c1c", fontSize: "14px" }}>
                  {accessMessage ?? "Access verification failed."}
                </div>
              )}

              {accessState === "signed-out" && (
                <form onSubmit={handleEmailSignIn} style={{ display: "grid", gap: "12px" }}>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(event) => setEmailInput(event.target.value)}
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 14px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#0f172a",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(event) => setPasswordInput(event.target.value)}
                      style={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        padding: "12px 14px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#0f172a",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                  {accessMessage && (
                    <div style={{ color: "#b91c1c", fontSize: "13px" }}>{accessMessage}</div>
                  )}
                  <button
                    type="submit"
                    disabled={signingIn}
                    style={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      borderRadius: "999px",
                      padding: "10px 18px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: "none",
                      cursor: signingIn ? "not-allowed" : "pointer",
                    }}
                  >
                    {signingIn ? "Signing in..." : "Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    style={{
                      backgroundColor: "#f8fafc",
                      color: "#0f172a",
                      borderRadius: "999px",
                      padding: "10px 18px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: "1px solid #e2e8f0",
                      cursor: signingIn ? "not-allowed" : "pointer",
                    }}
                  >
                    Continue with Google
                  </button>
                </form>
              )}

              {accessState === "denied" && (
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ color: "#b91c1c", fontSize: "14px", fontWeight: 700 }}>
                    Access denied.
                  </div>
                  <div style={{ color: "#475569", fontSize: "13px" }}>
                    Your account does not have permission to view this page. Contact support to request access.
                  </div>
                  {user?.email && (
                    <div style={{ color: "#64748b", fontSize: "12px" }}>Signed in as {user.email}</div>
                  )}
                  <button
                    type="button"
                    onClick={signOut}
                    style={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      borderRadius: "999px",
                      padding: "10px 18px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      border: "none",
                      cursor: "pointer",
                      justifySelf: "start",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default ResourcesPage;

