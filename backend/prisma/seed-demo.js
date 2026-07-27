// backend/prisma/seed-demo.js
//
// Jeu de données de présentation pour le Demo Day : un volume restreint mais
// cohérent, pensé pour être parcouru en direct plutôt que pour tester la montée en charge.
// Pour un volume important destiné aux tests de performance, voir seed-massive.js.

require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");

const DEMO_PASSWORD = "Password123!";
const HASH_ROUNDS = 10;

// Visuels disponibles dans frontend/public/assets/products/. Les produits dont
// le nom correspond (une fois slugifié) reçoivent l'image réelle ; les autres
// gardent imageUrl: null et le catalogue affiche un visuel de substitution.
const PRODUCT_IMAGE_SLUGS = new Set([
  "baume-calendula",
  "beurre-de-baratte",
  "brioche-pur-beurre",
  "cidre-doux-fermier",
  "confiture-fraise-rhubarbe",
  "faisselle-fermiere",
  "galettes-bretonnes",
  "jus-de-pomme-artisanal",
  "kouign-amann-individuel",
  "limonade-au-citron",
  "miel-de-chataignier",
  "miel-de-fleurs",
  "pain-au-levain",
  "pain-d-epices-artisanal",
  "rillettes-de-maquereau",
  "rillettes-de-legumes",
  "sardines-a-l-huile",
  "savon-surgras-avoine",
  "shampoing-solide",
  "terrine-de-saumon",
  "tomme-fermiere",
]);

function slugifyProductName(name) {
  return String(name)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductImageUrl(name) {
  const slug = slugifyProductName(name);
  return PRODUCT_IMAGE_SLUGS.has(slug) ? `/assets/products/${slug}.webp` : null;
}

const CATEGORIES = [
  { name: "Boissons artisanales", description: "Jus, cidres et boissons locales élaborés par de petits producteurs." },
  { name: "Épicerie sucrée", description: "Miels, pains d'épices et douceurs artisanales." },
  { name: "Produits frais", description: "Fromages et produits laitiers fermiers de saison." },
  { name: "Boulangerie", description: "Pains et viennoiseries au levain, fabrication artisanale." },
  { name: "Produits de la mer", description: "Conserves et préparations issues de la pêche côtière." },
  { name: "Cosmétiques naturels", description: "Savons et soins formulés avec des ingrédients naturels." },
];

const SUPPLIERS = [
  {
    email: "supplier1@kerno-demo.local",
    firstName: "Camille",
    lastName: "Le Gall",
    companyName: "Brasserie du Littoral",
    businessType: "Brasserie artisanale",
    description: "Brasserie familiale installée sur la côte atlantique, spécialisée dans les boissons artisanales élaborées à partir de fruits locaux.",
    location: "Nantes, Pays de la Loire, France",
    phone: "+33 2 40 11 22 33",
    website: "https://brasserie-du-littoral.example",
    category: "Boissons artisanales",
    products: [
      { name: "Cidre doux fermier", description: "Cidre fermier élaboré à partir de pommes locales, fermentation lente en cuve.", priceCents: 450, minimumOrderQuantity: 24, minimumOrderUnit: "UNIT" },
      { name: "Jus de pomme artisanal", description: "Jus de pomme pressé et pasteurisé, sans sucres ajoutés.", priceCents: 320, minimumOrderQuantity: 24, minimumOrderUnit: "UNIT" },
      { name: "Limonade au citron", description: "Limonade artisanale préparée avec des citrons frais et une eau de source locale.", priceCents: 280, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
    ],
  },
  {
    email: "supplier2@kerno-demo.local",
    firstName: "Antoine",
    lastName: "Mercier",
    companyName: "Miellerie du Verger",
    businessType: "Apiculteur",
    description: "Exploitation apicole familiale proposant des miels de fleurs et des spécialités sucrées à base de production locale.",
    location: "Angers, Pays de la Loire, France",
    phone: "+33 2 41 22 33 44",
    website: "https://miellerie-du-verger.example",
    category: "Épicerie sucrée",
    products: [
      { name: "Miel de fleurs", description: "Miel toutes fleurs récolté au printemps, non pasteurisé.", priceCents: 690, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
      { name: "Miel de châtaignier", description: "Miel de châtaignier à la saveur prononcée, récolte automnale.", priceCents: 790, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
      { name: "Pain d'épices artisanal", description: "Pain d'épices moelleux préparé avec le miel de l'exploitation.", priceCents: 550, minimumOrderQuantity: 10, minimumOrderUnit: "UNIT" },
    ],
  },
  {
    email: "supplier3@kerno-demo.local",
    firstName: "Léa",
    lastName: "Fontaine",
    companyName: "Fromagerie des Alpages",
    businessType: "Fromagerie artisanale",
    description: "Fromagerie de montagne travaillant le lait cru de son propre troupeau pour des produits frais de caractère.",
    location: "Grenoble, Auvergne-Rhône-Alpes, France",
    phone: "+33 4 76 33 44 55",
    website: "https://fromagerie-des-alpages.example",
    category: "Produits frais",
    products: [
      { name: "Tomme fermière", description: "Tomme au lait cru affinée six semaines en cave naturelle.", priceCents: 890, minimumOrderQuantity: 5, minimumOrderUnit: "KG" },
      { name: "Faisselle fermière", description: "Faisselle fraîche préparée quotidiennement à partir de lait entier.", priceCents: 340, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
      { name: "Beurre de baratte", description: "Beurre baratté traditionnellement, légèrement salé.", priceCents: 420, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
    ],
  },
  {
    email: "supplier4@kerno-demo.local",
    firstName: "Thomas",
    lastName: "Guillou",
    companyName: "Conserverie de Bretagne",
    businessType: "Petite conserverie",
    description: "Conserverie artisanale valorisant les produits de la pêche côtière bretonne, en petites séries.",
    location: "Vannes, Bretagne, France",
    phone: "+33 2 97 44 55 66",
    website: "https://conserverie-de-bretagne.example",
    category: "Produits de la mer",
    products: [
      { name: "Rillettes de maquereau", description: "Rillettes préparées à partir de maquereau pêché localement.", priceCents: 480, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
      { name: "Sardines à l'huile", description: "Sardines mises en conserve le jour de leur pêche.", priceCents: 390, minimumOrderQuantity: 24, minimumOrderUnit: "UNIT" },
      { name: "Terrine de saumon", description: "Terrine fine de saumon fumé et herbes fraîches.", priceCents: 620, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
    ],
  },
  {
    email: "supplier5@kerno-demo.local",
    firstName: "Manon",
    lastName: "Dubreuil",
    companyName: "Atelier Nature & Sens",
    businessType: "Atelier bio",
    description: "Atelier de cosmétique naturelle formulant des soins solides à partir d'ingrédients biologiques.",
    location: "Lyon, Auvergne-Rhône-Alpes, France",
    phone: "+33 4 78 55 66 77",
    website: "https://atelier-nature-et-sens.example",
    category: "Cosmétiques naturels",
    products: [
      { name: "Savon surgras avoine", description: "Savon saponifié à froid, enrichi en avoine et beurre de karité.", priceCents: 590, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
      { name: "Baume calendula", description: "Baume apaisant au calendula, formulé pour les peaux sensibles.", priceCents: 850, minimumOrderQuantity: 6, minimumOrderUnit: "UNIT" },
      { name: "Shampoing solide", description: "Shampoing solide sans sulfate, pour cheveux normaux à secs.", priceCents: 990, minimumOrderQuantity: 6, minimumOrderUnit: "UNIT" },
    ],
  },
  {
    email: "supplier6@kerno-demo.local",
    firstName: "Hugo",
    lastName: "Pelletier",
    companyName: "Boulangerie des Artisans",
    businessType: "Boulangerie artisanale",
    description: "Boulangerie au levain naturel, farines locales et fabrication quotidienne à petite échelle.",
    location: "Rennes, Bretagne, France",
    phone: "+33 2 99 66 77 88",
    website: "https://boulangerie-des-artisans.example",
    category: "Boulangerie",
    products: [
      { name: "Pain au levain", description: "Pain au levain naturel, fermentation longue, farine issue de meunerie locale.", priceCents: 480, minimumOrderQuantity: 10, minimumOrderUnit: "UNIT" },
      { name: "Brioche pur beurre", description: "Brioche moelleuse préparée avec un beurre fermier.", priceCents: 550, minimumOrderQuantity: 10, minimumOrderUnit: "UNIT" },
      { name: "Kouign-amann individuel", description: "Kouign-amann format individuel, spécialité bretonne au beurre salé.", priceCents: 390, minimumOrderQuantity: 12, minimumOrderUnit: "UNIT" },
    ],
  },
];

const STORES = [
  {
    email: "store1@kerno-demo.local",
    firstName: "Claire",
    lastName: "Berthier",
    storeName: "L'Épicerie du Marais",
    storeType: "Épicerie fine",
    location: "Paris, Île-de-France, France",
    phone: "+33 1 42 11 22 33",
    sourcingNeeds: "Recherche de producteurs locaux pour enrichir un rayon épicerie fine et boissons artisanales.",
  },
  {
    email: "store2@kerno-demo.local",
    firstName: "Nicolas",
    lastName: "Faure",
    storeName: "Le Comptoir Local",
    storeType: "Boutique de produits régionaux",
    location: "Lyon, Auvergne-Rhône-Alpes, France",
    phone: "+33 4 78 12 34 56",
    sourcingNeeds: "Sélection de produits régionaux et artisanaux pour une clientèle attachée aux circuits courts.",
  },
  {
    email: "store3@kerno-demo.local",
    firstName: "Sophie",
    lastName: "Renaud",
    storeName: "Maison Bio & Saveurs",
    storeType: "Magasin bio",
    location: "Bordeaux, Nouvelle-Aquitaine, France",
    phone: "+33 5 56 23 45 67",
    sourcingNeeds: "Développement d'une offre de cosmétiques naturels et d'épicerie biologique.",
  },
  {
    email: "store4@kerno-demo.local",
    firstName: "Julien",
    lastName: "Perrot",
    storeName: "La Fromagerie du Port",
    storeType: "Fromagerie",
    location: "Nantes, Pays de la Loire, France",
    phone: "+33 2 40 34 56 78",
    sourcingNeeds: "Approvisionnement en produits frais fermiers et spécialités de la mer pour un rayon traiteur.",
  },
  {
    email: "store5@kerno-demo.local",
    firstName: "Marine",
    lastName: "Girard",
    storeName: "Le Panier Gourmand",
    storeType: "Concept store",
    location: "Strasbourg, Grand Est, France",
    phone: "+33 3 88 45 67 89",
    sourcingNeeds: "Curation d'une sélection de producteurs pour un concept store gourmand et responsable.",
  },
];

const CONTACT_REQUESTS = [
  { storeIndex: 0, supplierIndex: 0, productName: "Cidre doux fermier", subject: "Demande de tarifs professionnels", message: "Bonjour, nous souhaiterions connaître vos tarifs professionnels ainsi que vos conditions de livraison pour un référencement en rayon.", requestedQuantity: "Commande initiale de lancement", status: "ACCEPTED" },
  { storeIndex: 0, supplierIndex: 1, productName: "Miel de fleurs", subject: "Référencement en magasin", message: "Votre miel correspond parfaitement à l'esprit de notre boutique. Pourriez-vous nous transmettre votre catalogue et vos conditions revendeur ?", requestedQuantity: "À définir selon catalogue", status: "PENDING" },
  { storeIndex: 1, supplierIndex: 2, productName: "Tomme fermière", subject: "Demande d'échantillons", message: "Nous aimerions recevoir un échantillon de votre tomme fermière avant de passer une première commande.", requestedQuantity: "Échantillon découverte", status: "PENDING" },
  { storeIndex: 1, supplierIndex: 3, productName: "Sardines à l'huile", subject: "Sélection produits régionaux", message: "Vos conserves s'intègrent bien à notre sélection de produits régionaux. Quels sont vos délais de livraison habituels ?", requestedQuantity: "Réassort mensuel potentiel", status: "ACCEPTED" },
  { storeIndex: 2, supplierIndex: 4, productName: "Savon surgras avoine", subject: "Question sur vos conditions revendeur", message: "Bonjour, nous préparons le lancement d'un rayon cosmétiques naturels et souhaiterions échanger sur vos conditions revendeur.", requestedQuantity: "À définir", status: "PENDING" },
  { storeIndex: 2, supplierIndex: 4, productName: "Shampoing solide", subject: "Demande de tarifs professionnels", message: "Pourriez-vous nous communiquer votre grille tarifaire professionnelle pour le shampoing solide ?", requestedQuantity: "Commande test", status: "PENDING" },
  { storeIndex: 3, supplierIndex: 3, productName: "Terrine de saumon", subject: "Mise en avant producteurs locaux", message: "Nous organisons une mise en avant de producteurs locaux ce trimestre et aimerions vous y associer.", requestedQuantity: "Stock pour opération commerciale", status: "ACCEPTED" },
  { storeIndex: 3, supplierIndex: 2, productName: "Beurre de baratte", subject: "Réassort possible après première commande", message: "Suite à une première commande satisfaisante, nous souhaitons évoquer les modalités d'un réassort régulier.", requestedQuantity: "Commande récurrente", status: "ACCEPTED" },
  { storeIndex: 4, supplierIndex: 5, productName: "Pain au levain", subject: "Recherche nouveautés pour notre boutique", message: "Nous recherchons de nouveaux partenaires boulangers pour compléter notre offre. Votre pain au levain nous intéresse particulièrement.", requestedQuantity: "Assortiment découverte", status: "PENDING" },
  { storeIndex: 4, supplierIndex: 0, productName: "Jus de pomme artisanal", subject: "Informations sur vos délais de livraison", message: "Pourriez-vous nous préciser vos délais de livraison ainsi que vos quantités minimales de commande ?", requestedQuantity: "Selon vos minimums", status: "PENDING" },
  { storeIndex: 0, supplierIndex: 5, productName: "Brioche pur beurre", subject: "Demande pour animation commerciale", message: "Nous organisons une animation autour des produits boulangers ce mois-ci et souhaiterions vous y intégrer.", requestedQuantity: "Stock animation boutique", status: "PENDING" },
  { storeIndex: 1, supplierIndex: 1, productName: "Pain d'épices artisanal", subject: "Commande test pour notre rayon", message: "Nous aimerions passer une commande test pour évaluer l'accueil de vos produits auprès de notre clientèle.", requestedQuantity: "Petite commande de lancement", status: "REJECTED" },
];

async function resetDatabase() {
  console.log("Nettoyage de la base de données...");

  await prisma.$executeRaw`
    TRUNCATE TABLE contact_requests, products, store_profiles, supplier_profiles, users, categories RESTART IDENTITY CASCADE
  `;

  console.log("Base nettoyée");
}

async function createCategories() {
  console.log("Création des catégories...");

  const createdCategories = await Promise.all(
    CATEGORIES.map((category) => prisma.category.create({ data: category })),
  );
  const categories = Object.fromEntries(
    createdCategories.map((category) => [category.name, category]),
  );

  console.log(`${Object.keys(categories).length} catégories créées`);
  return categories;
}

async function createSuppliers(passwordHash) {
  console.log("Création des fournisseurs de démonstration...");

  const suppliers = await Promise.all(
    SUPPLIERS.map(async (supplierData) => {
      const user = await prisma.user.create({
        data: {
          email: supplierData.email,
          passwordHash,
          role: "SUPPLIER",
          firstName: supplierData.firstName,
          lastName: supplierData.lastName,
        },
      });

      const profile = await prisma.supplierProfile.create({
        data: {
          userId: user.id,
          companyName: supplierData.companyName,
          description: supplierData.description,
          location: supplierData.location,
          businessType: supplierData.businessType,
          contactEmail: supplierData.email,
          phone: supplierData.phone,
          website: supplierData.website,
        },
      });

      return { user, profile, source: supplierData };
    }),
  );

  console.log(`${suppliers.length} fournisseurs créés`);
  return suppliers;
}

async function createStores(passwordHash) {
  console.log("Création des magasins de démonstration...");

  const stores = await Promise.all(
    STORES.map(async (storeData) => {
      const user = await prisma.user.create({
        data: {
          email: storeData.email,
          passwordHash,
          role: "STORE",
          firstName: storeData.firstName,
          lastName: storeData.lastName,
        },
      });

      const profile = await prisma.storeProfile.create({
        data: {
          userId: user.id,
          storeName: storeData.storeName,
          brandName: storeData.storeName,
          location: storeData.location,
          storeType: storeData.storeType,
          sourcingNeeds: storeData.sourcingNeeds,
          contactEmail: storeData.email,
          phone: storeData.phone,
        },
      });

      return { user, profile, source: storeData };
    }),
  );

  console.log(`${stores.length} magasins créés`);
  return stores;
}

async function createProducts(categories, suppliers) {
  console.log("Création des produits de démonstration...");

  const products = [];
  const productsBySupplierId = new Map();

  for (const supplier of suppliers) {
    const category = categories[supplier.source.category];

    const supplierProducts = await Promise.all(
      supplier.source.products.map((productData) => (
        prisma.product.create({
          data: {
            supplierId: supplier.profile.id,
            categoryId: category ? category.id : null,
            name: productData.name,
            description: productData.description,
            priceCents: productData.priceCents,
            priceUnit: "UNIT",
            minimumOrderQuantity: productData.minimumOrderQuantity,
            minimumOrderUnit: productData.minimumOrderUnit,
            origin: supplier.profile.location,
            imageUrl: getProductImageUrl(productData.name),
            isActive: true,
          },
        })
      )),
    );

    productsBySupplierId.set(supplier.profile.id, supplierProducts);
    products.push(...supplierProducts);
  }

  console.log(`${products.length} produits créés`);
  return { products, productsBySupplierId };
}

async function createContactRequests(stores, suppliers, productsBySupplierId) {
  console.log("Création des demandes de contact de démonstration...");

  const requests = CONTACT_REQUESTS.map((request) => {
    const store = stores[request.storeIndex].profile;
    const supplier = suppliers[request.supplierIndex].profile;
    const supplierProducts = productsBySupplierId.get(supplier.id) || [];
    const product = supplierProducts.find((item) => item.name === request.productName) || null;

    return {
      storeId: store.id,
      supplierId: supplier.id,
      productId: product ? product.id : null,
      subject: request.subject,
      message: request.message,
      requestedQuantity: request.requestedQuantity,
      status: request.status,
    };
  });

  await prisma.contactRequest.createMany({ data: requests });

  console.log(`${requests.length} demandes de contact créées`);
  return requests;
}

async function createSeedData() {
  const [passwordHash, categories] = await Promise.all([
    bcrypt.hash(DEMO_PASSWORD, HASH_ROUNDS),
    createCategories(),
  ]);

  const [suppliers, stores] = await Promise.all([
    createSuppliers(passwordHash),
    createStores(passwordHash),
  ]);

  const { products, productsBySupplierId } = await createProducts(categories, suppliers);
  const requests = await createContactRequests(stores, suppliers, productsBySupplierId);

  return { categories, suppliers, stores, products, requests };
}

async function main() {
  console.log("Démarrage du seed de démonstration KERNO...");
  console.log(`Mot de passe commun : ${DEMO_PASSWORD}`);

  await resetDatabase();
  const { categories, suppliers, stores, products, requests } = await createSeedData();

  console.log("");
  console.log("Seed de démonstration terminé avec succès.");
  console.log(`Comptes fournisseurs : ${suppliers.length}`);
  console.log(`Comptes magasins : ${stores.length}`);
  console.log(`Catégories : ${Object.keys(categories).length}`);
  console.log(`Produits : ${products.length}`);
  console.log(`Demandes : ${requests.length}`);
  console.log("");
  console.log("Comptes de démonstration :");
  console.log(`- fournisseur : supplier1@kerno-demo.local / ${DEMO_PASSWORD}`);
  console.log(`- magasin     : store1@kerno-demo.local / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed de démonstration :");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
