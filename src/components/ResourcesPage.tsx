import { useMemo, useState } from "react";
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
  Info,
  MessageSquare,
  Minus,
  Moon,
  Pill,
  Printer,
  RefreshCcw,
  RotateCcw,
  Shield,
  Syringe,
  UserCheck,
  Users,
  Utensils,
  X,
} from "lucide-react";
import LogoImage from "@/assets/asset-1.png";

type AuditScore = "yes" | "no" | "na";

const ICONS = {
  RefreshCcw,
  MessageSquare,
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
    title: "Nutrition & Hydration",
    icon: "Utensils",
    cqc: "QS: Supporting People to Live Healthier Lives",
    guidance: "NICE CG32: MUST screening. CQC expects evidence of person-centered dietary needs.",
    items: [
      "Is the MUST score calculated correctly and updated monthly?",
      "Are IDDSI levels for food and fluids clearly stated?",
      "Are food preferences (likes/dislikes) and allergies documented?",
      "Is there a clear weight management plan for scores of 1 or higher?",
    ],
  },
  {
    id: "skin",
    title: "Tissue Viability (Skin Care)",
    icon: "Shield",
    cqc: "QS: Safe and Effective Care",
    guidance: "NICE CG179: Risk assessment within 6 hours. CQC focuses on pressure ulcer prevention.",
    items: [
      "Is the Waterlow/Branden score accurate and monthly?",
      "Are repositioning intervals (e.g. 4-hourly) specified based on risk?",
      "Is the mattress type and current pump setting recorded?",
      "Are current wounds mapped and have an active treatment plan?",
    ],
  },
  {
    id: "continence",
    title: "Continence & Catheter Care",
    icon: "Droplets",
    cqc: "QS: Involving People",
    guidance: "NICE CG171 (Continence) & QS61 (Infection Control).",
    items: [
      "Is the specific pad type/size/absorbency documented?",
      "If catheterised: are insertion date and change due date recorded?",
      "Are catheter size and balloon volume (e.g. 10ml) documented?",
      "Is a toileting schedule in place for those requiring assistance?",
    ],
  },
  {
    id: "diabetes",
    title: "Diabetes Management",
    icon: "Syringe",
    cqc: "QS: Managing Risk",
    guidance: "NICE NG28. Evidence of hypo management and foot health.",
    items: [
      "Is there a person-specific Hypo Treatment Plan?",
      "Are target blood glucose ranges prescribed and recorded?",
      "Is there evidence of daily/weekly foot checks for diabetic residents?",
      "Is the frequency of BG monitoring clearly stated?",
    ],
  },
  {
    id: "medication",
    title: "Medication Support",
    icon: "Pill",
    cqc: "QS: Medicines Optimization",
    guidance: "NICE SC1. Focus on PRN protocols and covert pathways.",
    items: [
      'Are "As Required" (PRN) protocols detailed (Why, When, Max Dose)?',
      "Is there a signed Covert Meds pathway/MCA if applicable?",
      "Are medication allergies prominently recorded in the care plan?",
      "Is there a plan for non-compliance or refusal?",
    ],
  },
  {
    id: "mca",
    title: "MCA & DoLS",
    icon: "Gavel",
    cqc: "QS: Consent to Care and Treatment",
    guidance: "NICE NG108. Focus on decision-specific assessments.",
    items: [
      "Is there a decision-specific MCA for care, residence, and meds?",
      "Is the DoLS status (Authorised/Pending) accurately recorded?",
      'Is there evidence of the "Least Restrictive" principle being applied?',
      "Are Best Interests decisions documented and involve relevant others?",
    ],
  },
  {
    id: "personal",
    title: "Personal Care & Oral Health",
    icon: "UserCheck",
    cqc: "QS: Person-centred Care",
    guidance: "NICE NG48 (Oral health). Evidence of daily hygiene routines.",
    items: [
      "Is the preferred bathing frequency and method (bath/shower) documented?",
      "Is there a specific Oral Health plan for natural teeth or dentures?",
      "Are grooming preferences (shaving, hair, make-up) recorded?",
      "Are preferences for gender of carer documented?",
    ],
  },
  {
    id: "sleep",
    title: "Night Care & Sleep",
    icon: "Moon",
    cqc: "QS: Responding to People's Immediate Needs",
    guidance: "CQC expects care to reflect night-time preferences.",
    items: [
      "Is the preferred bedtime and waking routine described?",
      "Are night check frequencies (e.g. hourly) specified?",
      "Are preferences for lighting, temperature, and door status noted?",
      "Does the plan address interventions for night-time wakefulness?",
    ],
  },
  {
    id: "social",
    title: "Social, Life History & Occupation",
    icon: "Users",
    cqc: "QS: Equity in Experiences and Outcomes",
    guidance: 'NICE NG189. Evidence of "Meaningful Occupation".',
    items: [
      "Is a detailed Life History / Pen Portrait included?",
      "Are current social interests and hobbies clearly identified?",
      "Is there a record of significant family/friend relationships?",
      "Are cultural or religious preferences documented?",
    ],
  },
  {
    id: "mental",
    title: "Mental Health & Behavior",
    icon: "Brain",
    cqc: "QS: Safe and Effective Care",
    guidance: "NICE NG10. Focus on de-escalation and non-drug interventions.",
    items: [
      "Are specific triggers for distress or anxiety identified?",
      "Are non-pharmacological de-escalation techniques listed?",
      "Is there an ABC (Antecedent-Behaviour-Consequence) chart in use?",
      "Does the plan mention specific techniques for orientation/reassurance?",
    ],
  },
  {
    id: "eol",
    title: "End of Life & Advanced Planning",
    icon: "Heart",
    cqc: "QS: Care Provision, Integration and Continuity",
    guidance: "NICE NG142. Evidence of Advance Decisions.",
    items: [
      "Is the DNACPR / ReSPECT form status clearly visible?",
      "Is the Preferred Place of Death (PPoD) documented?",
      "Are spiritual, cultural, or religious wishes for end-of-life recorded?",
      "Is there an Advance Statement or Advance Decision (ADRT)?",
    ],
  },
];

function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return <Component className={className} />;
}

export function ResourcesPage() {
  const [scores, setScores] = useState<Record<string, AuditScore | undefined>>({});
  const today = new Date().toISOString().split("T")[0];
  const [meta, setMeta] = useState({ auditor: "", serviceUser: "", date: today });
  const [openGuidance, setOpenGuidance] = useState<Record<string, boolean>>({});
  const exportBaseColor = "#4F46E5";
  const exportHoverColor = "#4338ca";
  const clearBaseColor = "#303a4b";
  const clearHoverColor = "#3a465a";

  const handleScore = (key: string, val: AuditScore) => setScores((prev) => ({ ...prev, [key]: val }));
  const clearAll = () => {
    setScores({});
    setMeta({ auditor: "", serviceUser: "", date: today });
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
        <div>
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
                <div className="flex gap-4 print:hidden" style={{ flex: "0 0 auto", marginLeft: "auto", columnGap: "16px" }}>
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
                    className="inline-flex items-center gap-2 transition"
                  >
                    <Printer className="h-4 w-4" /> Export Report
                  </button>
                  <button
                    onClick={clearAll}
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
                      padding: "8px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      height: "34px",
                      lineHeight: "1",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 6px 14px rgba(15, 23, 42, 0.2)",
                    }}
                    className="inline-flex items-center gap-2 transition"
                  >
                    <RotateCcw className="h-4 w-4" /> Clear
                  </button>
                </div>
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
              style={{ borderRadius: "18px", border: "1px solid #eef2f7", fontFamily: '"Poppins", "Segoe UI", sans-serif' }}
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#eef2ff", border: "1px solid #e0e7ff", color: "#4F46E5" }}
                    >
                      {section.id === "reviews" ? (
                        <ClipboardCheck className="w-5 h-5" />
                      ) : (
                        <Icon name={section.icon} className="w-5 h-5" />
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
                  <div>
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
                      }}
                    >
                      <Info className="h-4 w-4" style={{ color: "#94a3b8" }} />
                      {isOpen ? "Hide Clinical Guidance" : "View Clinical Guidance"}
                    </button>
                      );
                    })()}
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
                <div
                  className="flex items-center gap-2 text-[10px] font-semibold uppercase"
                  style={{ color: "#8f9bb0", letterSpacing: "0.22em" }}
                >
                  <FileText className="h-4 w-4" />
                  Auditor Comments & Evidence Observed
                </div>
                <textarea
                  rows={3}
                  className="mt-4 w-full rounded-2xl border px-5 py-4 text-sm shadow-sm outline-none ring-0 transition focus:ring-2"
                  style={{ borderColor: "#e5edf5", color: "#475569" }}
                  placeholder="e.g. 'Observed MUST score of 3 but no referral made to dietician...'"
                />
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black tracking-tighter">{stats.percent}%</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Audit Score</p>
            </div>
            <div className="flex-1 max-w-sm w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${stats.percent}%` }} />
            </div>
            <div className="text-center md:text-right">
              <div className="bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-[10px] font-black uppercase mb-1">
                CQC Grade Potential
              </div>
              <p className="text-lg font-bold">
                {stats.percent >= 90 ? "Outstanding" : stats.percent >= 75 ? "Good" : "Needs Improvement"}
              </p>
            </div>
          </div>

          {stats.fails.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-3">
                <AlertTriangle className="text-rose-500 w-5 h-5" /> Remediation Requirements
              </h3>
              <div className="space-y-4">
                {stats.fails.map((fail, i) => (
                  <div key={`${fail.section}-${i}`} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="mb-2">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{fail.section}</span>
                      <p className="text-xs font-bold text-slate-800">{fail.item}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-[10px] text-slate-600 mb-4">
                      <strong>Standards Guidance:</strong> {fail.guidance}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" className="bg-white border border-slate-200 p-2 text-[10px] rounded-lg" placeholder="Corrective Action" />
                      <input type="text" className="bg-white border border-slate-200 p-2 text-[10px] rounded-lg" placeholder="Assigned To" />
                      <input type="date" className="bg-white border border-slate-200 p-2 text-[10px] rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default ResourcesPage;

