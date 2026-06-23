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
    title: "Sourcing plus rapide",
    text: "Les magasins trouvent des offres locales lisibles, comparables dans un même espace professionnel.",
    icon: "search",
  },
  {
    title: "Visibilité fournisseur",
    text: "Les producteurs présentent leur activité, leurs produits et leurs informations utiles avec clarté.",
    icon: "storefront",
  },
  {
    title: "Demandes structurées",
    text: "Chaque premier contact contient le contexte nécessaire pour engager une discussion commerciale utile.",
    icon: "form",
  },
];

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
    views: 42,
    visualKey: "honey",
    image: honeyImage,
  },
  {
    id: "jam",
    name: "Confiture fraise rhubarbe",
    category: "Confitures",
    price: "5,40 €",
    availability: "Disponible",
    views: 36,
    visualKey: "jam",
    image: jamImage,
  },
  {
    id: "apple-juice",
    name: "Jus de pomme fermier",
    category: "Boissons",
    price: "3,80 €",
    availability: "Stock limité",
    views: 31,
    visualKey: "appleJuice",
    image: appleJuiceImage,
  },
  {
    id: "biscuits",
    name: "Biscuits au sarrasin",
    category: "Biscuits",
    price: "4,20 €",
    availability: "Disponible",
    views: 26,
    visualKey: "buckwheatBiscuits",
    image: biscuitsImage,
  },
];

export const pricingPlans = [
  {
    name: "Freemium",
    price: "0 €",
    description: "Découvrir la plateforme avec une présence simple.",
  },
  {
    name: "Hebdomadaire",
    price: "15 €",
    period: "/ semaine",
    description:
      "Tester une visibilité renforcée sans engagement long.",
  },
  {
    name: "Mensuel",
    price: "49 €",
    period: "/ mois",
    description:
      "Structurer sa présence fournisseur avec plus de visibilité.",
  },
  {
    name: "Annuel",
    price: "490 €",
    period: "/ an",
    description:
      "L’offre la plus avantageuse pour une présence durable.",
    featured: true,
  },
];
