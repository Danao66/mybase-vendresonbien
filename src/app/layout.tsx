import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyBase — Vendez votre bien rapidement",
  description: "Soumettez votre bien immobilier à nos investisseurs qualifiés. Analyse sous 48h, sans curieux ni visites inutiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full">
      <body className={`${inter.className} bg-gray-950 text-white min-h-full flex flex-col antialiased`}>
        {/* Hidden form for Netlify bots to detect */}
        <form name="mybase-vendresonbien" data-netlify="true" hidden>
          {/* Écran routage */}
          <input type="text" name="type_proposition" />
          {/* Chemin A */}
          <input type="text" name="titre" />
          <input type="text" name="adresse" />
          <input type="text" name="surface_habitable" />
          <input type="text" name="type_bien" />
          <input type="text" name="etage" />
          <input type="text" name="annexes" />
          <input type="text" name="mot_vendeur" />
          <input type="text" name="prix_net_vendeur" />
          <input type="text" name="professionnel_immo" />
          <input type="text" name="frais_agence" />
          <input type="text" name="off_market" />
          <input type="text" name="duree_en_ligne" />
          <input type="text" name="negociation" />
          <input type="text" name="dpe" />
          <input type="text" name="etat_general" />
          <input type="text" name="devis_travaux" />
          <input type="text" name="montant_devis" />
          <input type="text" name="detail_travaux" />
          <input type="text" name="statut_bien" />
          <input type="text" name="loyer_mensuel" />
          <input type="text" name="type_bail" />
          <input type="text" name="debut_bail" />
          <input type="text" name="loyer_estime" />
          <input type="text" name="ca_annuel" />
          <input type="text" name="gestion_menage" />
          <input type="text" name="taxe_fonciere" />
          <input type="text" name="copropriete" />
          <input type="text" name="charges_copro" />
          <input type="text" name="charges_comprennent" />
          <input type="text" name="travaux_copro" />
          {/* Chemin B */}
          <input type="text" name="surface_totale" />
          <input type="text" name="type_projet" />
          <input type="text" name="etat_structurel" />
          <input type="text" name="nombre_lots" />
          <input type="text" name="compteurs_individuels" />
          <input type="text" name="nombre_compteurs" />
          <input type="text" name="detail_lots" />
          <input type="text" name="devis_globaux" />
          <input type="text" name="montant_devis_globaux" />
          <input type="text" name="assurance_pno" />
          <input type="text" name="autres_charges" />
          {/* Commun final */}
          <input type="text" name="potentiel_lcd" />
          <input type="text" name="potentiel_colocation" />
          <input type="text" name="reglementation_division" />
          <input type="text" name="prenom_nom" />
          <input type="text" name="telephone" />
          <input type="email" name="email" />
          <input type="text" name="contexte_vente" />
        </form>
        {children}
      </body>
    </html>
  );
}
