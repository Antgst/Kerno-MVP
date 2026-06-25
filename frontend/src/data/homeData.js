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
    title: "Pour les magasins",
    text: "Identifiez plus rapidement des fournisseurs, produits et opportunités adaptés à vos besoins.",
    icon: "search",
  },
  {
    title: "Pour les fournisseurs",
    text: "Présentez vos produits, gagnez en visibilité et facilitez les premiers contacts commerciaux.",
    icon: "storefront",
  },
  {
    title: "Un contact B2B structuré",
    text: "Centralisez les informations clés avant d’envoyer ou de recevoir une demande claire.",
    icon: "form",
  },
];

export const howItWorksSteps = [
  {
    step: "1",
    title: "Choisissez votre rôle",
    text: "Créez un compte magasin ou fournisseur pour accéder à un parcours adapté.",
  },
  {
    step: "2",
    title: "Complétez votre espace",
    text: "Les fournisseurs présentent leurs produits ; les magasins renseignent leur profil et leurs besoins.",
  },
  {
    step: "3",
    title: "Trouvez, publiez et contactez",
    text: "KERNO facilite la découverte, la mise en visibilité et le premier échange commercial.",
  },
];

export const heroTrustBar = {
  label: "Pensé pour les premiers échanges B2B",
  primary: ["Parcours magasin", "Parcours fournisseur", "Demandes structurées"],
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
    name: "Découverte",
    price: "0 €",
    description: "Explorez KERNO avec un accès limité",
    details: [
      "Aperçu des produits et opportunités disponibles",
      "Noms, coordonnées et détails sensibles masqués",
      "Idéal pour découvrir la plateforme sans engagement",
    ],
  },
  {
    name: "Pass 7 jours",
    price: "15 €",
    period: "/ 7 jours",
    description: "Testez KERNO sans engagement long",
    details: [
      "Accès complet temporaire aux informations clés",
      "Test du sourcing ou de la visibilité produit",
      "Sans abonnement ni engagement long",
    ],
  },
  {
    name: "Pro",
    price: "49 €",
    period: "/ mois",
    description: "Accès complet et présence continue",
    details: [
      "Profils, produits et coordonnées accessibles",
      "Demandes de contact ou de devis structurées",
      "Catalogue complet pour trouver ou être trouvé",
      "Présence active dans l’écosystème KERNO",
    ],
  },
  {
    name: "Premium annuel",
    price: "490 €",
    period: "/ an",
    description: "Accès complet + accompagnement renforcé",
    details: [
      "Tous les avantages de l’offre Pro",
      "Mise en avant dans les espaces clés KERNO",
      "Accompagnement visibilité ou sourcing selon le rôle",
      "Options premium selon le rôle : vitrine, contenu pro, sourcing accompagné",
    ],
    featured: true,
  },
];
