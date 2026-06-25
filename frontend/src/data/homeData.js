import appleJuiceImage from "../assets/landing/supplier-product-apple-juice.webp";
import biscuitsImage from "../assets/landing/supplier-product-buckwheat-biscuits.webp";
import honeyImage from "../assets/landing/supplier-product-honey.webp";
import jamImage from "../assets/landing/supplier-product-jam.webp";
import breweryImage from "../assets/landing/store-supplier-brewery.webp";
import cheeseImage from "../assets/landing/store-supplier-cheese.webp";
import farmImage from "../assets/landing/store-supplier-farm.webp";
import provenceImage from "../assets/landing/store-supplier-provence.webp";

export const heroImages = [
  {
    id: "farm",
    image: farmImage,
    alt: "Fournisseur local présenté sur KERNO",
  },
  {
    id: "brewery",
    image: breweryImage,
    alt: "Brasserie artisanale locale présentée sur KERNO",
  },
  {
    id: "cheese",
    image: cheeseImage,
    alt: "Fromages et produits laitiers présentés sur KERNO",
  },
  {
    id: "provence",
    image: provenceImage,
    alt: "Producteur provençal présenté sur KERNO",
  },
];

export const benefits = [
  {
    title: "Trouver plus vite des fournisseurs",
    text: "Les magasins repèrent des profils professionnels et des offres lisibles sans multiplier les échanges dispersés.",
    icon: "search",
  },
  {
    title: "Présenter ses produits clairement",
    text: "Les fournisseurs structurent leur profil, leurs produits et leurs informations utiles pour le premier contact.",
    icon: "storefront",
  },
  {
    title: "Envoyer des demandes exploitables",
    text: "Chaque demande contient le contexte nécessaire pour engager une discussion commerciale utile.",
    icon: "form",
  },
];

export const howItWorksSteps = [
  {
    step: "1",
    title: "Le fournisseur crée son profil",
    text: "Il présente son activité, sa zone et les informations clés attendues par les magasins.",
  },
  {
    step: "2",
    title: "Il publie ses produits",
    text: "Les produits sont organisés avec leurs informations utiles pour faciliter la lecture.",
  },
  {
    step: "3",
    title: "Le magasin envoie une demande",
    text: "Le premier contact commercial part d’une demande qualifiée et structurée.",
  },
];

export const heroTrustBar = {
  label: "Pensé pour les premiers échanges B2B",
  primary: [
    "Profils professionnels",
    "Demandes structurées",
    "Sans paiement intégré",
  ],
  secondary: [],
};

export const featuredSuppliers = [
  {
    id: "farm",
    name: "Ferme des Trois Vallées",
    location: "Normandie",
    category: "Produits fermiers",
    image: farmImage,
  },
  {
    id: "brewery",
    name: "Brasserie du Nord",
    location: "Hauts-de-France",
    category: "Boissons artisanales",
    image: breweryImage,
  },
  {
    id: "cheese",
    name: "Maison Dupont",
    location: "Normandie",
    category: "Fromages & Laitages",
    image: cheeseImage,
  },
  {
    id: "provence",
    name: "Jardins de Provence",
    location: "Provence",
    category: "Herbes & Épices",
    image: provenceImage,
  },
  {
    id: "vergers",
    name: "Vergers du Littoral",
    location: "Bretagne",
    category: "Boissons fermières",
    image: farmImage,
  },
  {
    id: "atelier",
    name: "Atelier Saint-Malo",
    location: "Bretagne",
    category: "Biscuits & Épicerie",
    image: cheeseImage,
  },
];

export const products = [
  {
    id: "honey",
    name: "Miel de fleurs sauvages",
    category: "Épicerie sucrée",
    price: "8,90 €",
    availability: "Disponible",
    supplier: "Ferme des Trois Vallées",
    origin: "Normandie",
    visualKey: "honey",
    image: honeyImage,
  },
  {
    id: "jam",
    name: "Confiture fraise rhubarbe",
    category: "Confitures",
    price: "5,40 €",
    availability: "Disponible",
    supplier: "Jardins de Provence",
    origin: "Provence",
    visualKey: "jam",
    image: jamImage,
  },
  {
    id: "apple-juice",
    name: "Jus de pomme fermier",
    category: "Boissons",
    price: "3,80 €",
    availability: "Stock limité",
    supplier: "Vergers du Littoral",
    origin: "Bretagne",
    visualKey: "appleJuice",
    image: appleJuiceImage,
  },
  {
    id: "biscuits",
    name: "Biscuits au sarrasin",
    category: "Biscuits",
    price: "4,20 €",
    availability: "Disponible",
    supplier: "Atelier Saint-Malo",
    origin: "Bretagne",
    visualKey: "buckwheatBiscuits",
    image: biscuitsImage,
  },
];

export const pricingPlans = [
  {
    name: "Freemium",
    price: "0 €",
    description: "Accès de découverte avec données limitées.",
    details: [
      "Aperçu des profils et produits",
      "Coordonnées et détails fournisseur limités",
      "Incite à passer à une visibilité complète",
    ],
  },
  {
    name: "Hebdomadaire",
    price: "15 €",
    period: "/ semaine",
    description: "Tester une présence ponctuelle sur une courte durée.",
    details: [
      "Mise en avant courte auprès des magasins",
      "Durée : 7 jours",
      "Sans engagement long",
    ],
  },
  {
    name: "Mensuel",
    price: "49 €",
    period: "/ mois",
    description: "Visibilité renforcée pour les fournisseurs actifs.",
    details: [
      "Mise en avant possible sur la landing",
      "Fournisseurs recommandés côté magasin",
      "Meilleure exposition sans engagement annuel",
    ],
  },
  {
    name: "Annuel",
    price: "490 €",
    period: "/ an",
    description: "Présence premium et accompagnement visibilité.",
    details: [
      "Aide à la page vitrine fournisseur",
      "Accompagnement contenu et présence digitale",
      "Options de communication fournisseur",
      "Meilleur coût sur 12 mois",
    ],
    featured: true,
  },
];
