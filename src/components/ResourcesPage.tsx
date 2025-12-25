import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertTriangle,
  Activity,
  BadgeCheck,
  BookOpen,
  ClipboardCheck,
  Brain,
  Droplets,
  Gavel,
  Heart,
  MessageSquare,
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
} from "lucide-react";
import LogoImage from "@/assets/asset-1.png";
import { Button } from "./ui/button";

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
  items: string[];
}[] = [
  {
    id: "reviews",
    title: "1. Care Plan Reviews & Signatures",
    icon: "RefreshCcw",
    cqc: "QS: Monitoring and Improving Outcomes",
    guidance: "NICE NG189: Evidence involving the person/representative. CQC expects regular, meaningful evaluation of effectiveness.",
    items: [
      'Is the care plan review meaningful (not just "no change")?',
      "Is there a monthly narrative explaining progress/decline?",
      "Is the resident or family signature present (or reason for absence)?",
      "Has the plan been updated following a significant event or hospital discharge?",
    ],
  },
  {
    id: "communication",
    title: "2. Communication & Call Bells",
    icon: "MessageSquare",
    cqc: "QS: Person-centred Care",
    guidance: "NICE NG189 & Accessible Information Standard. Critical for safety and autonomy.",
    items: [
      "Are sensory needs (hearing aids/glasses) clearly identified?",
      "Is the ability to use a standard call bell assessed?",
      "If unable to use a bell, is a risk-assessed alternative (pendant/sensor) documented?",
      "Is the preferred language and communication method recorded?",
    ],
  },
  {
    id: "mobility",
    title: "3. Mobility & Falls Prevention",
    icon: "Activity",
    cqc: "QS: Safe Environments",
    guidance: "NICE CG161: Multi-factorial falls risk assessment. CQC expects equipment safety.",
    items: [
      "Is a Falls Risk Assessment (FRAT) complete and dated?",
      "Does the plan specify the hoist type and sling size/type?",
      "Are walking aids (frame/stick) specified and location noted?",
      "Is there a post-fall protocol documented for anyone who has fallen in the last 30 days?",
    ],
  },
  {
    id: "nutrition",
    title: "4. Nutrition & Hydration",
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
    title: "5. Tissue Viability (Skin Care)",
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
    title: "6. Continence & Catheter Care",
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
    title: "7. Diabetes Management",
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
    title: "8. Medication Support",
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
    title: "9. MCA & DoLS",
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
    title: "10. Personal Care & Oral Health",
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
    title: "11. Night Care & Sleep",
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
    title: "12. Social, Life History & Occupation",
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
    title: "13. Mental Health & Behavior",
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
    title: "14. End of Life & Advanced Planning",
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

  const handleScore = (key: string, val: AuditScore) => setScores((prev) => ({ ...prev, [key]: val }));
  const clearAll = () => {
    setScores({});
    setMeta({ auditor: "", serviceUser: "", date: today });
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
          <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 shadow-lg bg-white">
            <div className="px-6 sm:px-8 py-6 flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white shadow-md rounded-2xl p-3 border border-slate-100">
                    <img
                      src={LogoImage}
                      alt="Coach4Improvement"
                      className="w-14 h-14 object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black leading-tight text-slate-900">Care Plan Quality Audit</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e3e8ff] border border-[#c8d0ff] px-3 py-1 font-extrabold uppercase tracking-tight text-[#3c4fb4]">
                    <BadgeCheck className="h-4 w-4 text-[#3c4fb4]" /> CQC Quality
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d5f2e3] border border-[#b4e5cc] px-3 py-1 font-extrabold uppercase tracking-tight text-[#0c6b4a]">
                    <BookOpen className="h-4 w-4 text-[#0c6b4a]" /> Clinical Standards
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" /> Clear
              </button>
            </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-600 uppercase tracking-[0.18em]">Service User Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none ring-0 transition focus:border-[#c8d0ff] focus:ring-2 focus:ring-[#e3e8ff]"
                    placeholder="Enter service user"
                    value={meta.serviceUser}
                    onChange={(e) => setMeta({ ...meta, serviceUser: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-600 uppercase tracking-[0.18em]">Auditor Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100 outline-none ring-0 transition focus:border-[#c8d0ff] focus:ring-2 focus:ring-[#e3e8ff]"
                    placeholder="Enter auditor name"
                    value={meta.auditor}
                    onChange={(e) => setMeta({ ...meta, auditor: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-slate-600 uppercase tracking-[0.18em]">Audit Date</label>
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

          <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
            <section key={section.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-white border-b border-slate-100 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      {section.id === "reviews" ? <ClipboardCheck className="w-5 h-5" /> : <Icon name={section.icon} className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-[#1f2c3b] uppercase">
                        {section.id === "reviews" ? "Care Plan Reviews & 'No Change' Audit" : section.title}
                      </h2>
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#3f51b5]">
                        {section.id === "reviews" ? "CQC Regulation 17 (Good Governance)" : section.cqc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-full border border-[#dce4f2] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#1f2c3b] hover:bg-[#f5f7fb] transition">
                      <BadgeCheck className="w-4 h-4 text-[#3f51b5]" />
                      View Clinical Guidance
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center text-[11px] font-semibold text-[#8892a0] uppercase tracking-[0.16em]">
                  <span className="col-span-8">Criteria</span>
                  <span className="col-span-1 text-center">Met</span>
                  <span className="col-span-1 text-center">No</span>
                  <span className="col-span-1 text-center">N/A</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {section.items.map((item, i) => {
                  const key = `${section.id}-${i}`;
                  const state = scores[key];
                  return (
                    <div key={key} className="grid grid-cols-12 gap-4 items-center px-4 py-5 hover:bg-slate-50/50 transition-colors">
                      <p className="col-span-8 text-base font-semibold text-[#1f2c3b] leading-relaxed m-0">{item}</p>
                      <div className="col-span-4 flex justify-center items-center gap-4">
                        {(["yes", "no", "na"] as AuditScore[]).map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScore(key, val)}
                            className={`h-11 w-11 rounded-full border transition-all flex items-center justify-center text-lg font-bold ${
                              val === "yes"
                                ? state === "yes"
                                  ? "border-[#c9e7d6] bg-[#e9f5ef] text-[#1f8c5c] shadow-sm"
                                  : "border-[#dfe6f0] text-[#c0c7d4] hover:border-[#c9e7d6]"
                                : val === "no"
                                ? state === "no"
                                  ? "border-[#f3c5ce] bg-[#fce9ed] text-[#cf304f] shadow-sm"
                                  : "border-[#dfe6f0] text-[#c0c7d4] hover:border-[#f3c5ce]"
                                : state === "na"
                                ? "border-[#dfe6f0] bg-[#f7f9fc] text-[#8f99aa]"
                                : "border-[#dfe6f0] text-[#c0c7d4] hover:border-[#dfe6f0]"
                            }`}
                          >
                            {val === "yes" ? "✓" : val === "no" ? "✕" : "—"}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
