"use client";

import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Building2,
  Home,
  Layers,
} from "lucide-react";

// ─── TYPES ──────────────────────────────────────────
type ScreenId =
  | "intro"
  | "routing"
  // Chemin A
  | "A1" | "A2" | "A3" | "A4" | "A5"
  // Chemin B
  | "B1" | "B2" | "B3" | "B4"
  // Commun
  | "Final1" | "Final2" | "Submit" | "Success";

interface FormData {
  // Routing
  type_proposition?: string;
  // Commun A & B
  titre?: string;
  adresse?: string;
  mot_vendeur?: string;
  // A1
  surface_habitable?: string;
  type_bien?: string;
  etage?: string;
  annexes?: string[];
  // A2 / B2
  prix_net_vendeur?: string;
  professionnel_immo?: string;
  frais_agence?: string;
  off_market?: string;
  duree_en_ligne?: string;
  negociation?: string;
  // A3
  dpe?: string;
  etat_general?: string;
  devis_travaux?: string;
  montant_devis?: string;
  detail_travaux?: string;
  // A4
  statut_bien?: string;
  loyer_mensuel?: string;
  type_bail?: string;
  debut_bail?: string;
  loyer_estime?: string;
  ca_annuel?: string;
  gestion_menage?: string;
  // A5 / B4
  taxe_fonciere?: string;
  copropriete?: string;
  charges_copro?: string;
  charges_comprennent?: string[];
  travaux_copro?: string;
  // B1
  surface_totale?: string;
  type_projet?: string;
  etat_structurel?: string;
  // B3
  nombre_lots?: string;
  compteurs_individuels?: string;
  detail_lots?: string;
  devis_globaux?: string;
  montant_devis_globaux?: string;
  // B4
  assurance_pno?: string;
  autres_charges?: string;
  // Final
  potentiel_lcd?: string;
  potentiel_colocation?: string;
  reglementation_division?: string;
  prenom_nom?: string;
  telephone?: string;
  email?: string;
  contexte_vente?: string;
  [key: string]: any;
}

// ─── PROGRESS ───────────────────────────────────────
const progressA: Record<string, number> = {
  intro: 0, routing: 5,
  A1: 15, A2: 30, A3: 45, A4: 60, A5: 70,
  Final1: 80, Final2: 90, Submit: 95, Success: 100,
};
const progressB: Record<string, number> = {
  intro: 0, routing: 5,
  B1: 15, B2: 30, B3: 50, B4: 65,
  Final1: 80, Final2: 90, Submit: 95, Success: 100,
};

// ─── CONTEXT & UI COMPONENTS ────────────────────────
const FormContext = createContext<{
  data: FormData;
  errors: Record<string, boolean>;
  update: (key: keyof FormData, value: string | string[]) => void;
  toggleArray: (key: keyof FormData, value: string) => void;
}>({
  data: {},
  errors: {},
  update: () => {},
  toggleArray: () => {},
});

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-medium text-gray-300 mb-2">
    {children} {required && <span className="text-amber-500">*</span>}
  </label>
);

const TextInput = ({ name, placeholder, type = "text", value, required }: { name: keyof FormData; placeholder?: string; type?: string; value?: string; required?: boolean }) => {
  const { data, update, errors } = useContext(FormContext);
  return (
    <input
      type={type}
      value={value || (data[name] as string) || ""}
      onChange={(e) => update(name, e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-gray-900 border ${errors[name] ? "border-red-500" : "border-gray-800"} rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors`}
      required={required}
    />
  );
};

const TextArea = ({ name, placeholder, rows = 4 }: { name: keyof FormData; placeholder?: string; rows?: number }) => {
  const { data, update, errors } = useContext(FormContext);
  return (
    <textarea
      value={(data[name] as string) || ""}
      onChange={(e) => update(name, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full bg-gray-900 border ${errors[name] ? "border-red-500" : "border-gray-800"} rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors resize-none`}
    />
  );
};

const Select = ({ name, options, placeholder }: { name: keyof FormData; options: string[]; placeholder?: string }) => {
  const { data, update, errors } = useContext(FormContext);
  return (
    <select
      value={(data[name] as string) || ""}
      onChange={(e) => update(name, e.target.value)}
      className={`w-full bg-gray-900 border ${errors[name] ? "border-red-500" : "border-gray-800"} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer`}
    >
      <option value="" className="text-gray-600">{placeholder || "Sélectionnez..."}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

const RadioOption = ({ name, value, label, emoji, description }: { name: keyof FormData; value: string; label: string; emoji?: string; description?: string }) => {
  const { data, update, errors } = useContext(FormContext);
  return (
    <button
      onClick={() => update(name, value)}
      className={`w-full text-left bg-gray-900 hover:bg-gray-800 border-2 ${(data[name] as string) === value ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]" : errors[name] ? "border-red-500/50" : "border-gray-800"} p-5 rounded-2xl transition-all hover:border-amber-500/60 group`}
    >
      <div className="text-lg text-white font-semibold flex items-center">
        {emoji && <span className="text-2xl mr-3">{emoji}</span>}
        {label}
      </div>
      {description && <div className="text-gray-400 text-sm mt-1 pl-9">{description}</div>}
    </button>
  );
};

const CheckboxOption = ({ name, value, label }: { name: keyof FormData; value: string; label: string }) => {
  const { data, toggleArray } = useContext(FormContext);
  const checked = ((data[name] as string[] | undefined) || []).includes(value);
  return (
    <button
      onClick={() => toggleArray(name, value)}
      className={`text-left bg-gray-900 hover:bg-gray-800 border-2 ${checked ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "border-gray-800"} p-4 rounded-xl transition-all hover:border-amber-500/60`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-gray-600"}`}>
          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-gray-950" />}
        </div>
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
    </button>
  );
};

const NextButton = ({ onClick, label = "Étape suivante" }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-[0_0_25px_rgba(245,158,11,0.2)] flex items-center justify-center"
  >
    {label} <ChevronRight className="ml-2 w-5 h-5" />
  </button>
);

const ScreenTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{title}</h2>
    {subtitle && <p className="text-gray-400 text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

// ─── COMPONENT ──────────────────────────────────────
export default function VendresonbienFunnel() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("intro");
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [data, setData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isPathB = data.type_proposition === "multi-lots";
  const prog = isPathB ? progressB : progressA;
  const progress = prog[currentScreen] ?? 0;

  const goTo = (screen: ScreenId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    setErrors({});
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prev = newHistory.pop();
    setHistory(newHistory);
    setCurrentScreen(prev as ScreenId);
    setErrors({});
  };

  const update = (key: keyof FormData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const toggleArray = (key: keyof FormData, value: string) => {
    const current = (data[key] as string[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, updated);
  };

  const validate = (fields: (keyof FormData)[]) => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    for (const field of fields) {
      const val = data[field];
      if (!val || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
        newErrors[field] = true;
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const submitToNetlify = async () => {
    const formBody = new URLSearchParams();
    formBody.append("form-name", "mybase-vendresonbien");

    let finalData = { ...data };
    
    // Format dynamic lots for Path B
    if (finalData.type_proposition === "multi-lots" && finalData.nombre_lots) {
      const numLots = parseInt(finalData.nombre_lots as string) || 0;
      let generatedDetails = "";
      
      for (let i = 1; i <= numLots; i++) {
        const type = finalData[`lot_${i}_type`] || "Non précisé";
        const surface = finalData[`lot_${i}_surface`] ? `${finalData[`lot_${i}_surface`]}m²` : "";
        const etat = finalData[`lot_${i}_etat`] || "";
        const dpe = finalData[`lot_${i}_dpe`] ? `DPE ${finalData[`lot_${i}_dpe`]}` : "";
        const statut = finalData[`lot_${i}_statut`] || "Non précisé";
        
        let rentDetails = "";
        if (statut === "Loué") {
          const loyer = finalData[`lot_${i}_loyer`] || "?";
          const bail = finalData[`lot_${i}_type_bail`] || "Non précisé";
          const debut = finalData[`lot_${i}_debut_bail`] || "?";
          rentDetails = `Loué ${loyer}€ (${bail}) [Début: ${debut}]`;
        } else if (statut === "Vide") {
          const loyerEstime = finalData[`lot_${i}_loyer_estime`] || "?";
          rentDetails = `Vide (Estimé: ${loyerEstime}€)`;
        } else {
          rentDetails = statut;
        }

        const travaux = finalData[`lot_${i}_travaux`] ? `| Travaux: ${finalData[`lot_${i}_travaux`]}` : "";

        const parts = [type, surface, etat, dpe, rentDetails].filter(Boolean).join(" | ");
        generatedDetails += `Lot ${i}: ${parts} ${travaux}\n`;
        
        // Clean up temporary dynamic keys
        delete finalData[`lot_${i}_type`];
        delete finalData[`lot_${i}_surface`];
        delete finalData[`lot_${i}_etat`];
        delete finalData[`lot_${i}_dpe`];
        delete finalData[`lot_${i}_statut`];
        delete finalData[`lot_${i}_loyer`];
        delete finalData[`lot_${i}_type_bail`];
        delete finalData[`lot_${i}_debut_bail`];
        delete finalData[`lot_${i}_loyer_estime`];
        delete finalData[`lot_${i}_travaux`];
      }
      finalData.detail_lots = generatedDetails.trim();
    }

    Object.entries(finalData).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formBody.append(key, Array.isArray(value) ? value.join(", ") : String(value));
      }
    });

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });
      goTo("Success");
    } catch {
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    }
  };


  // ─── SCREEN RENDERER ──────────────────────────────
  const renderScreen = () => {
    switch (currentScreen) {
      // ═══════════════ INTRO ═══════════════
      case "intro":
        return (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" /> Formulaire Vendeur MyBase
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Vendez votre bien <span className="text-amber-500">rapidement</span>, sans curieux ni visites inutiles.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Nos investisseurs sont qualifiés, finançables, et prêts à se positionner en moins de <strong className="text-white">48h</strong> sur les bons projets. Plus vous serez précis dans vos chiffres, plus vite nous pourrons présenter votre bien à l&apos;acheteur idéal.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <span>⏱️</span> Temps estimé : 4 minutes
            </div>
            <button
              onClick={() => goTo("routing")}
              className="mt-8 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold py-5 px-10 rounded-full text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center mx-auto"
            >
              COMMENCER <ChevronRight className="ml-2 w-6 h-6" />
            </button>
          </motion.div>
        );

      // ═══════════════ ROUTING ═══════════════
      case "routing":
        return (
          <motion.div key="routing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto space-y-8">
            <ScreenTitle title="Que souhaitez-vous nous proposer ?" />
            <div className="space-y-4">
              <button
                onClick={() => { update("type_proposition", "lot-unique"); goTo("A1"); }}
                className="w-full text-left bg-gray-900 overflow-hidden hover:bg-gray-800 border-2 border-gray-800 p-8 rounded-2xl transition-all hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group relative"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Home className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xl mb-2 text-white font-semibold">🏠 Un lot unique</div>
                    <div className="text-gray-400">Appartement, Maison classique, Studio, Local commercial</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => { update("type_proposition", "multi-lots"); goTo("B1"); }}
                className="w-full text-left bg-gray-900 overflow-hidden hover:bg-gray-800 border-2 border-gray-800 p-8 rounded-2xl transition-all hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group relative"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xl mb-2 text-white font-semibold">🏗️ Un projet multi-lots</div>
                    <div className="text-gray-400">Immeuble de rapport, Maison divisée ou à diviser</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        );

      // ═══════════════ CHEMIN A ═══════════════
      // ─── A1 : L'ESSENTIEL DU BIEN ───
      case "A1":
        return (
          <motion.div key="A1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="L'essentiel du bien" subtitle="Commençons par les informations clés de votre bien." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Titre de votre proposition</FieldLabel>
                <TextInput name="titre" placeholder="Ex: T3 Hypercentre Mâcon — Renta brute 8%" required />
                <p className="text-xs text-gray-600 mt-1">Soyez accrocheur !</p>
              </div>
              <div>
                <FieldLabel required>Adresse du bien</FieldLabel>
                <TextInput name="adresse" placeholder="Numéro, Rue, Code Postal, Ville" required />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">🔒 Le numéro et la rue exacte resteront strictement confidentiels.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Surface habitable (m²)</FieldLabel>
                  <TextInput name="surface_habitable" placeholder="Ex: 65" type="number" required />
                </div>
                <div>
                  <FieldLabel required>Type de bien</FieldLabel>
                  <Select name="type_bien" options={["Studio", "T1", "T2", "T3", "T4", "T5+", "Local commercial"]} />
                </div>
              </div>
              <div>
                <FieldLabel>Étage</FieldLabel>
                <Select name="etage" options={["RDC", "1er", "2ème", "3ème", "4ème", "5ème et +"]} />
              </div>
              <div>
                <FieldLabel>Annexes incluses</FieldLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Cave", "Parking", "Garage", "Balcon-Terrasse", "Jardin"].map((item) => (
                    <CheckboxOption key={item} name="annexes" value={item} label={item} />
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel required>Le mot du vendeur</FieldLabel>
                <TextArea name="mot_vendeur" placeholder="Décrivez l'emplacement, les atouts locatifs et l'ambiance du bien. Ne mettez pas de prix ici." rows={5} />
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["titre", "adresse", "surface_habitable", "type_bien", "mot_vendeur"])) goTo("A2");
            }} />
          </motion.div>
        );

      // ─── A2 : LES CHIFFRES DE LA VENTE ───
      case "A2":
        return (
          <motion.div key="A2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Les chiffres de la vente" subtitle="Ces informations sont essentielles pour qualifier votre bien auprès de nos investisseurs." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Prix Net Vendeur (€)</FieldLabel>
                <TextInput name="prix_net_vendeur" placeholder="Le montant que vous souhaitez recevoir dans votre poche" type="number" required />
              </div>
              <div>
                <FieldLabel required>Êtes-vous un professionnel de l&apos;immobilier ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="professionnel_immo" value="Oui" label="Oui" emoji="✅" />
                  <RadioOption name="professionnel_immo" value="Non" label="Non" emoji="❌" />
                </div>
              </div>
              {data.professionnel_immo === "Oui" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FieldLabel>Frais d&apos;agence TTC (€)</FieldLabel>
                  <TextInput name="frais_agence" placeholder="Montant TTC" type="number" />
                </motion.div>
              )}
              <div>
                <FieldLabel required>Le bien est-il un &quot;Off-Market&quot; (exclusivité réseau) ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="off_market" value="Oui" label="Oui — Exclusivité réseau" emoji="🔒" />
                  <RadioOption name="off_market" value="Non" label="Non — Déjà en ligne" emoji="🌐" />
                </div>
              </div>
              {data.off_market === "Non" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FieldLabel>Depuis combien de temps est-il en ligne ?</FieldLabel>
                  <div className="space-y-3">
                    <RadioOption name="duree_en_ligne" value="Moins d'1 mois" label="Moins d'1 mois" emoji="🕐" />
                    <RadioOption name="duree_en_ligne" value="1 à 3 mois" label="1 à 3 mois" emoji="🕑" />
                    <RadioOption name="duree_en_ligne" value="Plus de 3 mois" label="Plus de 3 mois" emoji="🕒" />
                  </div>
                </motion.div>
              )}
              <div>
                <FieldLabel required>Le vendeur est-il ouvert à la négociation ?</FieldLabel>
                <Select name="negociation" options={["Oui, si offre rapide", "Légèrement", "Prix ferme"]} />
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["prix_net_vendeur", "professionnel_immo", "off_market", "negociation"])) goTo("A3");
            }} />
          </motion.div>
        );

      // ─── A3 : ÉTAT & TRAVAUX ───
      case "A3":
        return (
          <motion.div key="A3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="État & Travaux" subtitle="La transparence sur l'état du bien est un atout majeur pour convaincre nos investisseurs." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Diagnostic de Performance Énergétique (DPE)</FieldLabel>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {["A", "B", "C", "D", "E", "F", "G", "Vierge"].map((letter) => {
                    const colors: Record<string, string> = {
                      A: "bg-green-500", B: "bg-lime-500", C: "bg-yellow-400", D: "bg-amber-500",
                      E: "bg-orange-500", F: "bg-red-500", G: "bg-red-700", Vierge: "bg-gray-600"
                    };
                    return (
                      <button
                        key={letter}
                        onClick={() => update("dpe", letter)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all ${data.dpe === letter ? `${colors[letter]} text-white scale-105 shadow-lg` : "bg-gray-800 text-gray-400 hover:bg-gray-700"} ${errors.dpe ? "ring-1 ring-red-500" : ""}`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <FieldLabel required>État général du bien</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="etat_general" value="Clé en main" label="Clé en main" emoji="✨" description="Aucun travaux" />
                  <RadioOption name="etat_general" value="Rafraîchissement léger" label="Rafraîchissement léger" emoji="🖌️" description="Peinture, sols, déco" />
                  <RadioOption name="etat_general" value="Rénovation moyenne" label="Rénovation moyenne" emoji="🔨" description="Cuisine, SDB, Électricité" />
                  <RadioOption name="etat_general" value="Rénovation lourde" label="Rénovation lourde" emoji="⚠️" description="Isolation, fenêtres, réagencement" />
                </div>
              </div>
              <div>
                <FieldLabel>Des devis travaux ont-ils été réalisés ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="devis_travaux" value="Oui" label="Oui" emoji="📋" />
                  <RadioOption name="devis_travaux" value="Non" label="Non" emoji="❌" />
                </div>
              </div>
              {data.devis_travaux === "Oui" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                  <div>
                    <FieldLabel>Montant total des devis (€)</FieldLabel>
                    <TextInput name="montant_devis" placeholder="Ex: 25000" type="number" />
                  </div>
                </motion.div>
              )}
              <div>
                <FieldLabel>Détail des travaux à prévoir</FieldLabel>
                <TextArea name="detail_travaux" placeholder="Soyez précis, nos investisseurs achètent avec des enveloppes travaux déjà calculées." rows={4} />
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["dpe", "etat_general"])) goTo("A4");
            }} />
          </motion.div>
        );

      // ─── A4 : EXPLOITATION & LOYERS ───
      case "A4":
        return (
          <motion.div key="A4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Exploitation & Loyers" subtitle="Ces données permettent de calculer la rentabilité nette instantanément." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Statut actuel du bien</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="statut_bien" value="Vendu Vide" label="Vendu Vide" emoji="📦" />
                  <RadioOption name="statut_bien" value="Vendu Loué" label="Vendu Loué" emoji="🔑" />
                  <RadioOption name="statut_bien" value="Courte Durée" label="Exploité en Courte Durée (Airbnb)" emoji="🏖️" />
                </div>
              </div>
              {data.statut_bien === "Vendu Loué" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pl-4 border-l-2 border-amber-500/30">
                  <div>
                    <FieldLabel>Loyer mensuel HC (€)</FieldLabel>
                    <TextInput name="loyer_mensuel" placeholder="Ex: 650" type="number" />
                  </div>
                  <div>
                    <FieldLabel>Type de bail</FieldLabel>
                    <Select name="type_bail" options={["Nu", "Meublé"]} />
                  </div>
                  <div>
                    <FieldLabel>Début du bail</FieldLabel>
                    <TextInput name="debut_bail" placeholder="JJ/MM/AAAA" />
                  </div>
                </motion.div>
              )}
              {data.statut_bien === "Vendu Vide" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pl-4 border-l-2 border-amber-500/30">
                  <FieldLabel>Loyer mensuel estimé après travaux (€)</FieldLabel>
                  <TextInput name="loyer_estime" placeholder="Ex: 700" type="number" />
                </motion.div>
              )}
              {data.statut_bien === "Courte Durée" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pl-4 border-l-2 border-amber-500/30">
                  <div>
                    <FieldLabel>Chiffre d&apos;Affaires annuel N-1 (€)</FieldLabel>
                    <TextInput name="ca_annuel" placeholder="Ex: 18000" type="number" />
                  </div>
                  <div>
                    <FieldLabel>Qui gère le ménage/linge ?</FieldLabel>
                    <TextInput name="gestion_menage" placeholder="Ex: Conciergerie locale, moi-même..." />
                  </div>
                </motion.div>
              )}
            </div>
            <NextButton onClick={() => {
              if (validate(["statut_bien"])) goTo("A5");
            }} />
          </motion.div>
        );

      // ─── A5 : CHARGES & COPROPRIÉTÉ ───
      case "A5":
        return (
          <motion.div key="A5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Charges & Copropriété" subtitle="Dernières données financières pour compléter l'analyse." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Taxe Foncière annuelle (€)</FieldLabel>
                <TextInput name="taxe_fonciere" placeholder="Ex: 850" type="number" required />
              </div>
              <div>
                <FieldLabel required>Le bien est-il en copropriété ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="copropriete" value="Oui" label="Oui" emoji="🏢" />
                  <RadioOption name="copropriete" value="Non" label="Non" emoji="🏠" />
                </div>
              </div>
              {data.copropriete === "Oui" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pl-4 border-l-2 border-amber-500/30">
                  <div>
                    <FieldLabel>Charges de copropriété annuelles (€)</FieldLabel>
                    <TextInput name="charges_copro" placeholder="Ex: 1200" type="number" />
                  </div>
                  <div>
                    <FieldLabel>Que comprennent les charges ?</FieldLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["Eau froide", "Eau chaude", "Chauffage", "Entretien parties communes", "Ascenseur"].map((item) => (
                        <CheckboxOption key={item} name="charges_comprennent" value={item} label={item} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Travaux importants votés ou à venir à la charge de l&apos;acquéreur ?</FieldLabel>
                    <TextArea name="travaux_copro" placeholder="Soyez transparent. Ex: ravalement de façade voté, 5000€ à la charge de l'acquéreur..." rows={3} />
                  </div>
                </motion.div>
              )}
            </div>
            <NextButton onClick={() => {
              if (validate(["taxe_fonciere", "copropriete"])) goTo("Final1");
            }} />
          </motion.div>
        );

      // ═══════════════ CHEMIN B ═══════════════
      // ─── B1 : L'ESSENTIEL DU BÂTIMENT ───
      case "B1":
        return (
          <motion.div key="B1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="L'essentiel du bâtiment" subtitle="Présentez votre projet multi-lots aux investisseurs." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Titre de votre proposition</FieldLabel>
                <TextInput name="titre" placeholder="Ex: Immeuble 4 lots hypercentre — Renta 9%" required />
              </div>
              <div>
                <FieldLabel required>Adresse du bien</FieldLabel>
                <TextInput name="adresse" placeholder="Numéro, Rue, Code Postal, Ville" required />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">🔒 Confidentiel — jamais transmis sans votre accord.</p>
              </div>
              <div>
                <FieldLabel required>Surface totale du bâtiment (m²)</FieldLabel>
                <TextInput name="surface_totale" placeholder="Ex: 280" type="number" required />
              </div>
              <div>
                <FieldLabel required>Type de projet</FieldLabel>
                <Select name="type_projet" options={["Immeuble de rapport entier", "Maison déjà divisée", "Maison à diviser"]} />
              </div>
              <div>
                <FieldLabel required>Le mot du vendeur</FieldLabel>
                <TextArea name="mot_vendeur" placeholder="Décrivez l'emplacement, l'état structurel et le potentiel de rentabilité." rows={5} />
              </div>
              <div>
                <FieldLabel required>État structurel (Toiture, Façade, Fondations)</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="etat_structurel" value="Excellent état" label="Excellent état" emoji="✨" description="Rien à prévoir sur les 10 prochaines années" />
                  <RadioOption name="etat_structurel" value="Bon état" label="Bon état" emoji="👍" description="Entretien courant" />
                  <RadioOption name="etat_structurel" value="Gros œuvre à prévoir" label="Gros œuvre à prévoir" emoji="⚠️" description="Toiture à refaire, fissures, etc." />
                </div>
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["titre", "adresse", "surface_totale", "type_projet", "mot_vendeur", "etat_structurel"])) goTo("B2");
            }} />
          </motion.div>
        );

      // ─── B2 : LES CHIFFRES DE LA VENTE (identique à A2) ───
      case "B2":
        return (
          <motion.div key="B2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Les chiffres de la vente" subtitle="Ces informations sont essentielles pour qualifier votre bien auprès de nos investisseurs." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Prix Net Vendeur (€)</FieldLabel>
                <TextInput name="prix_net_vendeur" placeholder="Le montant que vous souhaitez recevoir dans votre poche" type="number" required />
              </div>
              <div>
                <FieldLabel required>Êtes-vous un professionnel de l&apos;immobilier ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="professionnel_immo" value="Oui" label="Oui" emoji="✅" />
                  <RadioOption name="professionnel_immo" value="Non" label="Non" emoji="❌" />
                </div>
              </div>
              {data.professionnel_immo === "Oui" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FieldLabel>Frais d&apos;agence TTC (€)</FieldLabel>
                  <TextInput name="frais_agence" placeholder="Montant TTC" type="number" />
                </motion.div>
              )}
              <div>
                <FieldLabel required>Le bien est-il un &quot;Off-Market&quot; (exclusivité réseau) ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="off_market" value="Oui" label="Oui — Exclusivité réseau" emoji="🔒" />
                  <RadioOption name="off_market" value="Non" label="Non — Déjà en ligne" emoji="🌐" />
                </div>
              </div>
              {data.off_market === "Non" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FieldLabel>Depuis combien de temps est-il en ligne ?</FieldLabel>
                  <div className="space-y-3">
                    <RadioOption name="duree_en_ligne" value="Moins d'1 mois" label="Moins d'1 mois" emoji="🕐" />
                    <RadioOption name="duree_en_ligne" value="1 à 3 mois" label="1 à 3 mois" emoji="🕑" />
                    <RadioOption name="duree_en_ligne" value="Plus de 3 mois" label="Plus de 3 mois" emoji="🕒" />
                  </div>
                </motion.div>
              )}
              <div>
                <FieldLabel required>Le vendeur est-il ouvert à la négociation ?</FieldLabel>
                <Select name="negociation" options={["Oui, si offre rapide", "Légèrement", "Prix ferme"]} />
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["prix_net_vendeur", "professionnel_immo", "off_market", "negociation"])) goTo("B3");
            }} />
          </motion.div>
        );

      // ─── B3 : COMPOSITION DES LOTS & REVENUS ───
      case "B3": {
        const numLots = parseInt((data.nombre_lots as string) || "0");
        return (
          <motion.div key="B3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto space-y-6">
            <ScreenTitle title="Composition des lots & Revenus" subtitle="Détaillez chaque lot pour permettre une analyse précise." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Nombre de lots total</FieldLabel>
                <TextInput name="nombre_lots" placeholder="Ex: 4" type="number" required />
              </div>
              <div>
                <FieldLabel required>Les compteurs (Eau/Électricité) sont-ils individuels ?</FieldLabel>
                <div className="space-y-3">
                  <RadioOption name="compteurs_individuels" value="Oui" label="Oui" emoji="✅" />
                  <RadioOption name="compteurs_individuels" value="Non" label="Non" emoji="❌" />
                  <RadioOption name="compteurs_individuels" value="Partiel" label="Partiel" emoji="⚡" />
                </div>
              </div>
              
              {/* RENDU DYNAMIQUE DES LOTS */}
              {numLots > 0 && numLots <= 50 && (
                <div className="space-y-6 mt-8">
                  {Array.from({ length: numLots }).map((_, idx) => {
                    const i = idx + 1;
                    const statut = data[`lot_${i}_statut`] as string;
                    return (
                      <div key={i} className="p-5 border border-amber-500/20 bg-gray-950 rounded-2xl space-y-4 shadow-inner">
                        <h4 className="text-amber-500 font-bold mb-3 flex items-center gap-2"><Layers className="w-5 h-5"/> Lot n°{i}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel required>Type (T1, T2...)</FieldLabel>
                            <Select name={`lot_${i}_type`} options={["Studio", "T1", "T2", "T3", "T4", "T5+", "Local commercial"]} />
                          </div>
                          <div>
                            <FieldLabel>Surface (m²)</FieldLabel>
                            <TextInput name={`lot_${i}_surface`} type="number" placeholder="Facultatif" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel>État général</FieldLabel>
                            <Select name={`lot_${i}_etat`} options={["Excellent / Rénové", "Bon état", "Rafraichissement", "Gros travaux"]} placeholder="Facultatif" />
                          </div>
                          <div>
                            <FieldLabel>DPE (Si connu)</FieldLabel>
                            <Select name={`lot_${i}_dpe`} options={["A", "B", "C", "D", "E", "F", "G", "Vierge"]} placeholder="Facultatif" />
                          </div>
                        </div>

                        <div>
                          <FieldLabel required>Statut du lot</FieldLabel>
                          <div className="grid grid-cols-2 gap-3">
                            <RadioOption name={`lot_${i}_statut`} value="Vide" label="Vide" />
                            <RadioOption name={`lot_${i}_statut`} value="Loué" label="Loué" />
                          </div>
                        </div>

                        {statut === "Loué" && (
                          <div className="pl-4 border-l-2 border-amber-500/30 space-y-4">
                            <div>
                              <FieldLabel>Loyer mensuel HC (€)</FieldLabel>
                              <TextInput name={`lot_${i}_loyer`} type="number" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <FieldLabel>Type de bail</FieldLabel>
                                <Select name={`lot_${i}_type_bail`} options={["Nu", "Meublé"]} />
                              </div>
                              <div>
                                <FieldLabel>Début du bail</FieldLabel>
                                <TextInput name={`lot_${i}_debut_bail`} placeholder="JJ/MM/AAAA" />
                              </div>
                            </div>
                          </div>
                        )}

                        {statut === "Vide" && (
                          <div className="pl-4 border-l-2 border-amber-500/30">
                            <FieldLabel>Loyer mensuel estimé après travaux (Meublé - €)</FieldLabel>
                            <TextInput name={`lot_${i}_loyer_estime`} type="number" />
                          </div>
                        )}

                        <div className="mt-2">
                          <FieldLabel>Estimation travaux pour ce lot (€)</FieldLabel>
                          <TextInput name={`lot_${i}_travaux`} type="number" placeholder="Facultatif" />
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-gray-800">
                <FieldLabel>Chiffrage global des travaux (Parties communes + Lots)</FieldLabel>
                <div className="space-y-3 mb-4">
                  <RadioOption name="devis_globaux" value="Oui" label="Oui, une enveloppe globale a été estimée" emoji="📋" />
                  <RadioOption name="devis_globaux" value="Non" label="Non" emoji="❌" />
                </div>
                {data.devis_globaux === "Oui" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <FieldLabel>Montant total estimé (€)</FieldLabel>
                    <TextInput name="montant_devis_globaux" placeholder="Ex: 80000" type="number" />
                  </motion.div>
                )}
              </div>
            </div>
            <NextButton onClick={() => {
              // Vérifier que type_ et statut_ sont remplis pour tous les lots = Validation dynamique
              let valid = validate(["nombre_lots", "compteurs_individuels"]);
              if (valid && numLots > 0) {
                 for (let i = 1; i <= numLots; i++) {
                    if (!data[`lot_${i}_type`] || !data[`lot_${i}_statut`]) {
                       valid = false;
                       // Alert is used as fallback below.
                    }
                 }
              }
              if (valid) goTo("B4");
              else alert("Veuillez remplir les informations obligatoires (Type et Statut) pour chaque lot.");
            }} />
          </motion.div>
        );
      }

      // ─── B4 : CHARGES DU BÂTIMENT ───
      case "B4":
        return (
          <motion.div key="B4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Charges du bâtiment" subtitle="Dernières données financières pour compléter l'analyse." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Taxe Foncière annuelle totale (€)</FieldLabel>
                <TextInput name="taxe_fonciere" placeholder="Ex: 3200" type="number" required />
              </div>
              <div>
                <FieldLabel>Assurance PNO annuelle (€)</FieldLabel>
                <TextInput name="assurance_pno" placeholder="Facultatif — Ex: 450" type="number" />
              </div>
              <div>
                <FieldLabel>Autres charges annuelles (et précisions si besoin)</FieldLabel>
                <TextArea name="autres_charges" placeholder="Ex: Électricité des communs 300€/an, Concierge 500€/an..." rows={2} />
              </div>
            </div>
            <NextButton onClick={() => {
              if (validate(["taxe_fonciere"])) goTo("Final1");
            }} />
          </motion.div>
        );

      // ═══════════════ ÉCRANS COMMUNS ═══════════════
      // ─── FINAL 1 : LE POTENTIEL ───
      case "Final1":
        return (
          <motion.div key="Final1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Le potentiel du bien" subtitle="Ces informations aident nos investisseurs à projeter les stratégies de rendement." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel>Potentiel Location Courte Durée (Airbnb)</FieldLabel>
                <Select name="potentiel_lcd" options={["Fort potentiel", "Modéré", "Interdit par la copro ou la mairie"]} />
              </div>
              <div>
                <FieldLabel>Potentiel Colocation</FieldLabel>
                <Select name="potentiel_colocation" options={["Fort potentiel", "Modéré", "Peu adapté (trop petit)"]} />
              </div>
              {isPathB && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <FieldLabel>Réglementation de la ville concernant la division de lots (PLU, parking) ?</FieldLabel>
                  <TextArea name="reglementation_division" placeholder="Informations sur le PLU, les places de parking obligatoires, etc." rows={4} />
                </motion.div>
              )}
            </div>
            <NextButton onClick={() => goTo("Final2")} />
          </motion.div>
        );

      // ─── FINAL 2 : VOS COORDONNÉES ───
      case "Final2":
        return (
          <motion.div key="Final2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6">
            <ScreenTitle title="Vos coordonnées" subtitle="Pour que nous puissions vous contacter si le bien valide nos critères de rentabilité (Score BASE)." />
            <div className="bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-800 space-y-5">
              <div>
                <FieldLabel required>Prénom & Nom</FieldLabel>
                <TextInput name="prenom_nom" placeholder="Votre prénom et nom" required />
              </div>
              <div>
                <FieldLabel required>Numéro de téléphone</FieldLabel>
                <TextInput name="telephone" placeholder="WhatsApp privilégié" type="tel" required />
                <p className="text-xs text-gray-500 mt-1">📱 WhatsApp privilégié pour une communication rapide</p>
              </div>
              <div>
                <FieldLabel required>Adresse Email</FieldLabel>
                <TextInput name="email" placeholder="votre@email.com" type="email" required />
              </div>
              <div>
                <FieldLabel required>Contexte de la vente</FieldLabel>
                <TextArea name="contexte_vente" placeholder="Pourquoi vendez-vous ? (Succession, arbitrage, besoin de liquidités...). Cette info reste 100% confidentielle entre nous." rows={4} />
                <p className="text-xs text-gray-500 mt-1">🔒 Information 100% confidentielle — usage interne uniquement.</p>
              </div>
            </div>
            <NextButton
              label="SOUMETTRE MON BIEN À L'ANALYSE"
              onClick={() => {
                if (validate(["prenom_nom", "telephone", "email", "contexte_vente"])) {
                  submitToNetlify();
                }
              }}
            />
          </motion.div>
        );

      // ─── SUCCESS ───
      case "Success":
        return (
          <motion.div key="Success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full space-y-8 text-center">
            <div className="bg-gray-900 p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl space-y-6">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                🎉 Votre dossier est entre nos mains !
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                L&apos;algorithme MyBase et notre équipe vont analyser vos chiffres. Si le bien correspond aux critères d&apos;un de nos investisseurs (Budget, Rentabilité, Emplacement), nous vous contacterons sous <strong className="text-amber-500">48h</strong>.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mt-6">
                <p className="text-amber-400 font-bold text-lg mb-3">📸 Dernière étape indispensable</p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Pour que nous puissions valider le dossier, envoyez-nous immédiatement les <strong className="text-white">photos, vidéos et plans du bien</strong> par WhatsApp ou par mail en précisant l&apos;adresse du bien.
                </p>
                <div className="mt-4 p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <p className="text-red-400 text-sm font-semibold">⚠️ Un dossier sans photo ne sera pas traité.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ─── MAIN RENDER ──────────────────────────────────
  return (
    <FormContext.Provider value={{ data, errors, update, toggleArray }}>
      <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center relative w-full bg-gray-950 font-sans">
        {/* Progress bar */}
        {currentScreen !== "intro" && currentScreen !== "Success" && (
          <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Back button */}
      {history.length > 0 && currentScreen !== "Success" && (
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-white flex items-center transition-colors px-3 py-2 rounded-lg hover:bg-gray-800 text-sm md:text-base border border-transparent hover:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </button>
        </div>
      )}

      <div className="w-full mt-16 md:mt-0">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>

        {/* MyBase branding */}
        {currentScreen !== "Success" && (
          <div className="mt-12 text-center">
            <p className="text-gray-700 text-xs">
              MyBase — Réseau d&apos;investisseurs qualifiés
            </p>
          </div>
        )}
      </div>
    </FormContext.Provider>
  );
}
