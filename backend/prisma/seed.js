// backend/prisma/seed.js

require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");

const DEMO_PASSWORD = "Password123!";

async function resetDatabase() {
  console.log("🧹 Nettoyage de la base de données...");

  await prisma.contactRequest.deleteMany();
  await prisma.product.deleteMany();
  await prisma.storeProfile.deleteMany();
  await prisma.supplierProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Base nettoyée");
}

async function createCategories() {
  console.log("📦 Création des catégories...");

  const categories = [
    {
      name: "Boissons artisanales",
      description: "Jus, cidres, bières artisanales, sirops et boissons locales.",
    },
    {
      name: "Épicerie sucrée",
      description: "Miels, confitures, biscuits, chocolats et produits gourmands.",
    },
    {
      name: "Épicerie salée",
      description: "Conserves, tartinables, huiles, condiments et spécialités régionales.",
    },
    {
      name: "Produits frais",
      description: "Fromages, yaourts, œufs, fruits, légumes et produits de saison.",
    },
    {
      name: "Boulangerie",
      description: "Pains, brioches, viennoiseries et produits boulangers artisanaux.",
    },
    {
      name: "Produits bio",
      description: "Produits certifiés bio ou issus d’une agriculture responsable.",
    },
    {
      name: "Produits bretons",
      description: "Spécialités de Bretagne : galettes, caramel, cidre, sarrasin.",
    },
    {
      name: "Cosmétiques naturels",
      description: "Savons, baumes, huiles et soins fabriqués avec des ingrédients naturels.",
    },
  ];

  const createdCategories = {};

  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });

    createdCategories[created.name] = created;
  }

  console.log(`✅ ${categories.length} catégories créées`);

  return createdCategories;
}

async function createSupplier({ email, firstName, lastName, profile }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "SUPPLIER",
      firstName,
      lastName,
    },
  });

  const supplierProfile = await prisma.supplierProfile.create({
    data: {
      userId: user.id,
      companyName: profile.companyName,
      description: profile.description,
      location: profile.location,
      businessType: profile.businessType,
      contactEmail: profile.contactEmail,
      phone: profile.phone,
      website: profile.website,
    },
  });

  return {
    user,
    profile: supplierProfile,
  };
}

async function createStore({ email, firstName, lastName, profile }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "STORE",
      firstName,
      lastName,
    },
  });

  const storeProfile = await prisma.storeProfile.create({
    data: {
      userId: user.id,
      storeName: profile.storeName,
      brandName: profile.brandName,
      location: profile.location,
      storeType: profile.storeType,
      sourcingNeeds: profile.sourcingNeeds,
      contactEmail: profile.contactEmail,
      phone: profile.phone,
    },
  });

  return {
    user,
    profile: storeProfile,
  };
}

async function createSuppliers() {
  console.log("🚚 Création des fournisseurs...");

  const suppliers = {};

  suppliers.verger = await createSupplier({
    email: "contact@vergers-bretons.fr",
    firstName: "Maël",
    lastName: "Le Goff",
    profile: {
      companyName: "Les Vergers Bretons",
      description:
        "Producteur artisanal de jus de pomme, cidre doux et compotes fabriqués à partir de pommes bretonnes.",
      location: "Rennes, Bretagne",
      businessType: "Producteur local",
      contactEmail: "contact@vergers-bretons.fr",
      phone: "02 99 00 10 20",
      website: "https://vergers-bretons.example",
    },
  });

  suppliers.miel = await createSupplier({
    email: "bonjour@ruches-emeraude.fr",
    firstName: "Claire",
    lastName: "Martin",
    profile: {
      companyName: "Les Ruches d’Émeraude",
      description:
        "Apiculteur indépendant proposant des miels de fleurs, de sarrasin et des produits dérivés de la ruche.",
      location: "Dinan, Bretagne",
      businessType: "Apiculteur",
      contactEmail: "bonjour@ruches-emeraude.fr",
      phone: "02 96 45 11 32",
      website: "https://ruches-emeraude.example",
    },
  });

  suppliers.biscuiterie = await createSupplier({
    email: "pro@biscuiterie-sarrasin.fr",
    firstName: "Yann",
    lastName: "Kerbrat",
    profile: {
      companyName: "Biscuiterie du Sarrasin",
      description:
        "Fabricant de biscuits bretons, palets au beurre, sablés au sarrasin et spécialités locales.",
      location: "Quimper, Bretagne",
      businessType: "Artisan biscuitier",
      contactEmail: "pro@biscuiterie-sarrasin.fr",
      phone: "02 98 90 34 12",
      website: "https://biscuiterie-sarrasin.example",
    },
  });

  suppliers.fromagerie = await createSupplier({
    email: "contact@fromagerie-vallee.fr",
    firstName: "Lucie",
    lastName: "Bernard",
    profile: {
      companyName: "Fromagerie de la Vallée",
      description:
        "Fromagerie artisanale spécialisée dans les tommes, fromages frais et yaourts fermiers.",
      location: "Vitré, Bretagne",
      businessType: "Fromagerie artisanale",
      contactEmail: "contact@fromagerie-vallee.fr",
      phone: "02 99 76 44 88",
      website: "https://fromagerie-vallee.example",
    },
  });

  suppliers.savonnerie = await createSupplier({
    email: "atelier@savonnerie-armor.fr",
    firstName: "Élodie",
    lastName: "Robin",
    profile: {
      companyName: "Savonnerie Armor",
      description:
        "Atelier de savons naturels, shampoings solides et baumes fabriqués en petites séries.",
      location: "Saint-Malo, Bretagne",
      businessType: "Cosmétiques artisanaux",
      contactEmail: "atelier@savonnerie-armor.fr",
      phone: "02 23 18 42 51",
      website: "https://savonnerie-armor.example",
    },
  });

  console.log("✅ Fournisseurs créés");

  return suppliers;
}

async function createStores() {
  console.log("🏪 Création des magasins...");

  const stores = {};

  stores.epicerieRennes = await createStore({
    email: "contact@epicerie-rennes.fr",
    firstName: "Sophie",
    lastName: "Durand",
    profile: {
      storeName: "L’Épicerie du Centre",
      brandName: "Épicerie du Centre",
      location: "Rennes, Bretagne",
      storeType: "Épicerie fine",
      sourcingNeeds:
        "Recherche de produits bretons artisanaux, boissons locales, biscuits et produits frais.",
      contactEmail: "contact@epicerie-rennes.fr",
      phone: "02 99 12 45 78",
    },
  });

  stores.bioBetton = await createStore({
    email: "achats@marche-bio-betton.fr",
    firstName: "Thomas",
    lastName: "Moreau",
    profile: {
      storeName: "Marché Bio Betton",
      brandName: "Marché Bio",
      location: "Betton, Bretagne",
      storeType: "Magasin bio",
      sourcingNeeds:
        "Produits bio, producteurs locaux, miels, jus, fromages et cosmétiques naturels.",
      contactEmail: "achats@marche-bio-betton.fr",
      phone: "02 99 55 81 20",
    },
  });

  stores.conceptStore = await createStore({
    email: "hello@maison-local.fr",
    firstName: "Camille",
    lastName: "Lemoine",
    profile: {
      storeName: "Maison Local",
      brandName: "Maison Local",
      location: "Nantes, Pays de la Loire",
      storeType: "Concept store",
      sourcingNeeds:
        "Produits artisanaux premium, épicerie cadeau, cosmétiques naturels et produits régionaux.",
      contactEmail: "hello@maison-local.fr",
      phone: "02 40 18 70 33",
    },
  });

  console.log("✅ Magasins créés");

  return stores;
}

async function createProducts(categories, suppliers) {
  console.log("🛒 Création des produits...");

  const products = {};

  products.jusPomme = await prisma.product.create({
    data: {
      supplierId: suppliers.verger.profile.id,
      categoryId: categories["Boissons artisanales"].id,
      name: "Jus de pomme artisanal",
      description:
        "Jus de pomme trouble, pressé à froid, sans sucres ajoutés. Bouteille en verre de 1 L.",
      priceInfo: "2,90 € HT / bouteille",
      minimumOrder: "24 bouteilles",
      origin: "Ille-et-Vilaine, Bretagne",
      imageUrl: "/assets/products/jus-pomme-artisanal.webp",
      isActive: true,
    },
  });

  products.cidreDoux = await prisma.product.create({
    data: {
      supplierId: suppliers.verger.profile.id,
      categoryId: categories["Produits bretons"].id,
      name: "Cidre doux fermier",
      description:
        "Cidre doux breton, léger et fruité, idéal pour les épiceries fines et rayons régionaux.",
      priceInfo: "3,40 € HT / bouteille",
      minimumOrder: "18 bouteilles",
      origin: "Bretagne",
      imageUrl: "/assets/products/cidre-doux-fermier.webp",
      isActive: true,
    },
  });

  products.mielFleurs = await prisma.product.create({
    data: {
      supplierId: suppliers.miel.profile.id,
      categoryId: categories["Épicerie sucrée"].id,
      name: "Miel de fleurs sauvages",
      description:
        "Miel toutes fleurs récolté localement, texture douce et goût floral équilibré.",
      priceInfo: "5,80 € HT / pot de 250 g",
      minimumOrder: "30 pots",
      origin: "Côtes-d’Armor, Bretagne",
      imageUrl: "/assets/products/miel-fleurs-sauvages.webp",
      isActive: true,
    },
  });

  products.mielSarrasin = await prisma.product.create({
    data: {
      supplierId: suppliers.miel.profile.id,
      categoryId: categories["Produits bretons"].id,
      name: "Miel de sarrasin",
      description:
        "Miel breton au goût puissant, parfait pour une offre régionale authentique.",
      priceInfo: "6,50 € HT / pot de 250 g",
      minimumOrder: "24 pots",
      origin: "Bretagne",
      imageUrl: "/assets/products/miel-sarrasin.webp",
      isActive: true,
    },
  });

  products.biscuitsSarrasin = await prisma.product.create({
    data: {
      supplierId: suppliers.biscuiterie.profile.id,
      categoryId: categories["Épicerie sucrée"].id,
      name: "Biscuits au sarrasin",
      description:
        "Biscuits croustillants au sarrasin breton, fabriqués au beurre frais.",
      priceInfo: "3,20 € HT / paquet",
      minimumOrder: "36 paquets",
      origin: "Quimper, Bretagne",
      imageUrl: "/assets/products/biscuits-sarrasin.webp",
      isActive: true,
    },
  });

  products.paletsBretons = await prisma.product.create({
    data: {
      supplierId: suppliers.biscuiterie.profile.id,
      categoryId: categories["Produits bretons"].id,
      name: "Palets bretons pur beurre",
      description:
        "Palets bretons épais et fondants, recette traditionnelle au beurre de baratte.",
      priceInfo: "3,60 € HT / boîte",
      minimumOrder: "24 boîtes",
      origin: "Finistère, Bretagne",
      imageUrl: "/assets/products/palets-bretons.webp",
      isActive: true,
    },
  });

  products.tomme = await prisma.product.create({
    data: {
      supplierId: suppliers.fromagerie.profile.id,
      categoryId: categories["Produits frais"].id,
      name: "Tomme fermière affinée",
      description:
        "Fromage fermier affiné 8 semaines, vendu à la coupe ou en portions professionnelles.",
      priceInfo: "14,90 € HT / kg",
      minimumOrder: "5 kg",
      origin: "Vitré, Bretagne",
      imageUrl: "/assets/products/tomme-fermiere.webp",
      isActive: true,
    },
  });

  products.yaourts = await prisma.product.create({
    data: {
      supplierId: suppliers.fromagerie.profile.id,
      categoryId: categories["Produits frais"].id,
      name: "Yaourts fermiers nature",
      description:
        "Yaourts nature au lait entier, conditionnés en pots individuels.",
      priceInfo: "0,72 € HT / pot",
      minimumOrder: "96 pots",
      origin: "Ille-et-Vilaine, Bretagne",
      imageUrl: "/assets/products/yaourts-fermiers.webp",
      isActive: true,
    },
  });

  products.savon = await prisma.product.create({
    data: {
      supplierId: suppliers.savonnerie.profile.id,
      categoryId: categories["Cosmétiques naturels"].id,
      name: "Savon naturel au lait d’avoine",
      description:
        "Savon doux fabriqué à froid, adapté aux peaux sensibles, sans parfum synthétique.",
      priceInfo: "3,10 € HT / savon",
      minimumOrder: "40 savons",
      origin: "Saint-Malo, Bretagne",
      imageUrl: "/assets/products/savon-lait-avoine.webp",
      isActive: true,
    },
  });

  products.baume = await prisma.product.create({
    data: {
      supplierId: suppliers.savonnerie.profile.id,
      categoryId: categories["Cosmétiques naturels"].id,
      name: "Baume réparateur au calendula",
      description:
        "Baume naturel multi-usage pour mains sèches, lèvres et petites zones irritées.",
      priceInfo: "6,90 € HT / pot",
      minimumOrder: "24 pots",
      origin: "Bretagne",
      imageUrl: "/assets/products/baume-calendula.webp",
      isActive: true,
    },
  });

  console.log("✅ Produits créés");

  return products;
}

async function createContactRequests(stores, suppliers, products) {
  console.log("✉️ Création des demandes de contact...");

  const storeList = [
    stores.epicerieRennes.profile,
    stores.bioBetton.profile,
    stores.conceptStore.profile,
  ];

  const supplierProductMap = [
    {
      supplier: suppliers.verger.profile,
      products: [products.jusPomme, products.cidreDoux],
    },
    {
      supplier: suppliers.miel.profile,
      products: [products.mielFleurs, products.mielSarrasin],
    },
    {
      supplier: suppliers.biscuiterie.profile,
      products: [products.biscuitsSarrasin, products.paletsBretons],
    },
    {
      supplier: suppliers.fromagerie.profile,
      products: [products.tomme, products.yaourts],
    },
    {
      supplier: suppliers.savonnerie.profile,
      products: [products.savon, products.baume],
    },
  ];

  const requestTemplates = [
    {
      subject: "Demande de tarifs professionnels",
      message:
        "Bonjour, nous sommes intéressés par vos produits pour notre boutique. Pouvez-vous nous transmettre vos tarifs professionnels et conditions de commande ?",
      requestedQuantity: "Commande test",
      status: "PENDING",
    },
    {
      subject: "Référencement en magasin",
      message:
        "Bonjour, nous aimerions étudier un référencement de vos produits dans notre point de vente. Avez-vous un catalogue professionnel à nous envoyer ?",
      requestedQuantity: "À définir selon catalogue",
      status: "PENDING",
    },
    {
      subject: "Commande test pour notre rayon local",
      message:
        "Bonjour, nous souhaitons effectuer une première commande test afin d’évaluer l’intérêt de nos clients pour vos produits.",
      requestedQuantity: "Petite commande de lancement",
      status: "ACCEPTED",
    },
    {
      subject: "Informations sur vos délais de livraison",
      message:
        "Bonjour, vos produits nous intéressent. Pouvez-vous nous préciser vos délais de livraison, minimums de commande et zones desservies ?",
      requestedQuantity: "Selon vos minimums",
      status: "PENDING",
    },
    {
      subject: "Demande pour animation commerciale",
      message:
        "Bonjour, nous préparons une mise en avant de producteurs locaux. Seriez-vous disponible pour fournir des produits et supports de présentation ?",
      requestedQuantity: "Stock animation boutique",
      status: "PENDING",
    },
    {
      subject: "Sélection produits régionaux",
      message:
        "Bonjour, nous cherchons à enrichir notre sélection de produits régionaux. Votre offre semble correspondre à notre clientèle.",
      requestedQuantity: "Réassort mensuel potentiel",
      status: "ACCEPTED",
    },
    {
      subject: "Demande d’échantillons",
      message:
        "Bonjour, serait-il possible de recevoir quelques échantillons ou une proposition de colis découverte pour tester vos produits ?",
      requestedQuantity: "Échantillons ou colis découverte",
      status: "PENDING",
    },
    {
      subject: "Question sur vos conditions revendeur",
      message:
        "Bonjour, nous souhaiterions connaître vos marges conseillées, vos franco de port et vos conditions de paiement pour les revendeurs.",
      requestedQuantity: "À définir",
      status: "PENDING",
    },
    {
      subject: "Produit indisponible temporairement",
      message:
        "Bonjour, nous étions intéressés par ce produit mais notre planning d’achat est repoussé. Nous reviendrons vers vous plus tard.",
      requestedQuantity: "Non confirmé",
      status: "REJECTED",
    },
    {
      subject: "Réassort possible après première commande",
      message:
        "Bonjour, nous envisageons une première commande suivie d’un réassort régulier si les ventes sont satisfaisantes.",
      requestedQuantity: "Commande initiale puis réassort",
      status: "ACCEPTED",
    },
  ];

  const requests = [];

  for (const supplierEntry of supplierProductMap) {
    for (let i = 0; i < 10; i++) {
      const store = storeList[i % storeList.length];
      const product = supplierEntry.products[i % supplierEntry.products.length];
      const template = requestTemplates[i];

      requests.push({
        storeId: store.id,
        supplierId: supplierEntry.supplier.id,
        productId: product.id,
        subject: `${template.subject} - ${product.name}`,
        message: template.message,
        requestedQuantity: template.requestedQuantity,
        status: template.status,
      });
    }
  }

  await prisma.contactRequest.createMany({
    data: requests,
  });

  console.log(`✅ ${requests.length} demandes de contact créées`);
}

async function main() {
  console.log("🌱 Démarrage du seed Kerno...");

  await resetDatabase();

  const categories = await createCategories();
  const suppliers = await createSuppliers();
  const stores = await createStores();
  const products = await createProducts(categories, suppliers);

  await createContactRequests(stores, suppliers, products);

  console.log("");
  console.log("🎉 Seed terminé avec succès !");
  console.log("");
  console.log("Comptes de démo :");
  console.log(`Mot de passe commun : ${DEMO_PASSWORD}`);
  console.log("");
  console.log("Fournisseurs :");
  console.log("- contact@vergers-bretons.fr");
  console.log("- bonjour@ruches-emeraude.fr");
  console.log("- pro@biscuiterie-sarrasin.fr");
  console.log("- contact@fromagerie-vallee.fr");
  console.log("- atelier@savonnerie-armor.fr");
  console.log("");
  console.log("Magasins :");
  console.log("- contact@epicerie-rennes.fr");
  console.log("- achats@marche-bio-betton.fr");
  console.log("- hello@maison-local.fr");
}

main()
  .catch((error) => {
    console.error("❌ Erreur pendant le seed :");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });