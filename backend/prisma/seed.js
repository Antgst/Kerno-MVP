// backend/prisma/seed.js

require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/lib/prisma");

const DEMO_PASSWORD = "Password123!";
const HASH_ROUNDS = 10;

// Ajuste ces valeurs si tu veux une base encore plus grosse.
const SUPPLIER_COUNT = 80;
const STORE_COUNT = 50;
const MAX_PRODUCTS_PER_SUPPLIER = 20;
const REQUEST_COUNT = 900;

const FIRST_NAMES = [
  "Camille", "Alexandre", "Sophie", "Thomas", "Léa", "Hugo", "Manon", "Lucas",
  "Chloé", "Antoine", "Élodie", "Nicolas", "Julie", "Mathieu", "Claire", "Yann",
  "Maël", "Lucie", "Noémie", "Quentin", "Sarah", "Bastien", "Marine", "Romain",
  "Anaïs", "Pierre", "Justine", "Florian", "Morgane", "Adrien", "Inès", "Maxime",
];

const LAST_NAMES = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand",
  "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David",
  "Bertrand", "Roux", "Vincent", "Fournier", "Morel", "Girard", "André", "Mercier",
  "Dupont", "Lambert", "Bonnet", "François", "Martinez", "Le Goff", "Kerbrat", "Lemoine",
];

const LOCATIONS = [
  { city: "Paris", region: "Île-de-France", phonePrefix: "01" },
  { city: "Boulogne-Billancourt", region: "Île-de-France", phonePrefix: "01" },
  { city: "Versailles", region: "Île-de-France", phonePrefix: "01" },
  { city: "Lyon", region: "Auvergne-Rhône-Alpes", phonePrefix: "04" },
  { city: "Grenoble", region: "Auvergne-Rhône-Alpes", phonePrefix: "04" },
  { city: "Clermont-Ferrand", region: "Auvergne-Rhône-Alpes", phonePrefix: "04" },
  { city: "Marseille", region: "Provence-Alpes-Côte d’Azur", phonePrefix: "04" },
  { city: "Nice", region: "Provence-Alpes-Côte d’Azur", phonePrefix: "04" },
  { city: "Avignon", region: "Provence-Alpes-Côte d’Azur", phonePrefix: "04" },
  { city: "Toulouse", region: "Occitanie", phonePrefix: "05" },
  { city: "Montpellier", region: "Occitanie", phonePrefix: "04" },
  { city: "Nîmes", region: "Occitanie", phonePrefix: "04" },
  { city: "Bordeaux", region: "Nouvelle-Aquitaine", phonePrefix: "05" },
  { city: "La Rochelle", region: "Nouvelle-Aquitaine", phonePrefix: "05" },
  { city: "Pau", region: "Nouvelle-Aquitaine", phonePrefix: "05" },
  { city: "Nantes", region: "Pays de la Loire", phonePrefix: "02" },
  { city: "Angers", region: "Pays de la Loire", phonePrefix: "02" },
  { city: "Le Mans", region: "Pays de la Loire", phonePrefix: "02" },
  { city: "Rennes", region: "Bretagne", phonePrefix: "02" },
  { city: "Brest", region: "Bretagne", phonePrefix: "02" },
  { city: "Vannes", region: "Bretagne", phonePrefix: "02" },
  { city: "Saint-Malo", region: "Bretagne", phonePrefix: "02" },
  { city: "Lille", region: "Hauts-de-France", phonePrefix: "03" },
  { city: "Amiens", region: "Hauts-de-France", phonePrefix: "03" },
  { city: "Arras", region: "Hauts-de-France", phonePrefix: "03" },
  { city: "Strasbourg", region: "Grand Est", phonePrefix: "03" },
  { city: "Nancy", region: "Grand Est", phonePrefix: "03" },
  { city: "Reims", region: "Grand Est", phonePrefix: "03" },
  { city: "Dijon", region: "Bourgogne-Franche-Comté", phonePrefix: "03" },
  { city: "Besançon", region: "Bourgogne-Franche-Comté", phonePrefix: "03" },
  { city: "Tours", region: "Centre-Val de Loire", phonePrefix: "02" },
  { city: "Orléans", region: "Centre-Val de Loire", phonePrefix: "02" },
  { city: "Caen", region: "Normandie", phonePrefix: "02" },
  { city: "Rouen", region: "Normandie", phonePrefix: "02" },
  { city: "Le Havre", region: "Normandie", phonePrefix: "02" },
  { city: "Ajaccio", region: "Corse", phonePrefix: "04" },
  { city: "Bastia", region: "Corse", phonePrefix: "04" },
];

const CATEGORIES = [
  { name: "Boissons artisanales", description: "Jus, cidres, bières artisanales, sirops et boissons locales." },
  { name: "Épicerie sucrée", description: "Miels, confitures, biscuits, chocolats et produits gourmands." },
  { name: "Épicerie salée", description: "Conserves, tartinables, huiles, condiments et spécialités régionales." },
  { name: "Produits frais", description: "Fromages, yaourts, œufs, fruits, légumes et produits de saison." },
  { name: "Boulangerie", description: "Pains, brioches, viennoiseries et produits boulangers artisanaux." },
  { name: "Produits bio", description: "Produits certifiés bio ou issus d’une agriculture responsable." },
  { name: "Produits régionaux", description: "Spécialités locales issues des différentes régions françaises." },
  { name: "Cosmétiques naturels", description: "Savons, baumes, huiles et soins fabriqués avec des ingrédients naturels." },
  { name: "Traiteur artisanal", description: "Plats préparés, tartes, quiches, bocaux et recettes prêtes à vendre." },
  { name: "Café, thé et infusions", description: "Torréfaction artisanale, thés, tisanes et mélanges botaniques." },
  { name: "Produits de la mer", description: "Conserves marines, rillettes, algues et spécialités littorales." },
  { name: "Viandes et charcuteries", description: "Charcuteries artisanales, terrines, salaisons et préparations bouchères." },
];

const SUPPLIER_TYPES = [
  "Producteur local", "Artisan transformateur", "Ferme familiale", "Manufacture artisanale",
  "Atelier bio", "Coopérative régionale", "Maison traditionnelle", "Petite conserverie",
  "Brasserie artisanale", "Fromagerie artisanale", "Apiculteur", "Biscuiterie artisanale",
];

const STORE_TYPES = [
  "Épicerie fine", "Magasin bio", "Concept store", "Cave et épicerie", "Primeur",
  "Boutique de produits régionaux", "Superette indépendante", "Commerce de proximité",
  "Boutique cadeau gourmande", "Coffee shop", "Fromagerie", "Traiteur boutique",
];

const PRODUCT_CATALOG = [
  { category: "Boissons artisanales", names: ["Jus de pomme artisanal", "Limonade au citron", "Cidre doux fermier", "Sirop de sureau", "Kéfir de fruits", "Thé glacé pêche-verveine", "Jus de poire", "Nectar d’abricot"] },
  { category: "Épicerie sucrée", names: ["Miel de fleurs", "Confiture fraise-rhubarbe", "Caramel beurre salé", "Pâte à tartiner noisette", "Sablés pur beurre", "Biscuits au sarrasin", "Nougat tendre", "Chocolat noir artisanal"] },
  { category: "Épicerie salée", names: ["Rillettes de légumes", "Tapenade verte", "Huile de noix", "Moutarde à l’ancienne", "Pickles croquants", "Tartinable tomate basilic", "Sel aux herbes", "Crackers graines"] },
  { category: "Produits frais", names: ["Tomme fermière", "Yaourts fermiers nature", "Œufs plein air", "Beurre de baratte", "Fromage frais ail et fines herbes", "Légumes de saison", "Faisselle fermière", "Crème dessert vanille"] },
  { category: "Boulangerie", names: ["Pain au levain", "Brioche pur beurre", "Focaccia romarin", "Pain complet graines", "Kouign-amann individuel", "Madeleines artisanales", "Pain d’épices", "Croûtons ail persil"] },
  { category: "Produits bio", names: ["Granola bio", "Farine de sarrasin bio", "Lentilles vertes bio", "Compote pomme bio", "Savon solide bio", "Infusion détox bio", "Pois chiches bio", "Pesto bio"] },
  { category: "Produits régionaux", names: ["Galettes bretonnes", "Calissons artisanaux", "Pain d’épices de Dijon", "Canistrelli corses", "Pralines roses", "Bêtises de Cambrai", "Sel de Guérande", "Herbes de Provence"] },
  { category: "Cosmétiques naturels", names: ["Savon surgras avoine", "Baume calendula", "Shampoing solide", "Huile sèche nourrissante", "Déodorant naturel", "Crème mains karité", "Savon lavande", "Baume lèvres miel"] },
  { category: "Traiteur artisanal", names: ["Quiche légumes", "Bocal curry lentilles", "Tarte salée poireaux", "Soupe potimarron", "Lasagnes végétales", "Houmous citron", "Salade céréales", "Bocal ratatouille"] },
  { category: "Café, thé et infusions", names: ["Café moka torréfié", "Infusion verveine", "Thé noir bergamote", "Rooibos vanille", "Tisane nuit calme", "Café décaféiné", "Maté citron", "Mélange thym-romarin"] },
  { category: "Produits de la mer", names: ["Rillettes de maquereau", "Algues séchées", "Soupe de poisson", "Terrine de saumon", "Sel fumé", "Sardines à l’huile", "Tartare d’algues", "Bisque artisanale"] },
  { category: "Viandes et charcuteries", names: ["Terrine de campagne", "Saucisson sec", "Pâté au piment", "Jambon fumé", "Rillettes de porc", "Bœuf séché", "Chorizo artisanal", "Coppa fermière"] },
];

const REQUEST_TEMPLATES = [
  { subject: "Demande de tarifs professionnels", quantity: "Commande test", status: "PENDING" },
  { subject: "Référencement en magasin", quantity: "À définir selon catalogue", status: "PENDING" },
  { subject: "Commande test pour notre rayon local", quantity: "Petite commande de lancement", status: "ACCEPTED" },
  { subject: "Informations sur vos délais de livraison", quantity: "Selon vos minimums", status: "PENDING" },
  { subject: "Demande pour animation commerciale", quantity: "Stock animation boutique", status: "PENDING" },
  { subject: "Sélection produits régionaux", quantity: "Réassort mensuel potentiel", status: "ACCEPTED" },
  { subject: "Demande d’échantillons", quantity: "Échantillons ou colis découverte", status: "PENDING" },
  { subject: "Question sur vos conditions revendeur", quantity: "À définir", status: "PENDING" },
  { subject: "Produit indisponible temporairement", quantity: "Non confirmé", status: "REJECTED" },
  { subject: "Réassort possible après première commande", quantity: "Commande initiale puis réassort", status: "ACCEPTED" },
  { subject: "Mise en avant producteurs locaux", quantity: "Opération commerciale 3 semaines", status: "PENDING" },
  { subject: "Recherche nouveautés pour notre boutique", quantity: "Assortiment découverte", status: "PENDING" },
];

function pick(array, index) {
  return array[index % array.length];
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function formatLocation(location) {
  return `${location.city}, ${location.region}, France`;
}

function phone(location, index) {
  const number = String(10000000 + index * 7919).slice(0, 8);
  return `${location.phonePrefix} ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 8)}`;
}

function companyName(index, location) {
  const prefixes = ["Maison", "Atelier", "Ferme", "Domaine", "Comptoir", "Manufacture", "Jardins", "Saveurs", "Ruches", "Biscuiterie", "Brasserie", "Fromagerie"];
  const suffixes = ["du Terroir", "des Halles", "de la Vallée", "du Littoral", "des Saisons", "du Marché", "des Collines", "du Centre", "des Artisans", "du Soleil", "de l’Ouest", "du Vieux Bourg"];
  return `${pick(prefixes, index)} ${pick(suffixes, index + 3)} - ${location.city}`;
}

function storeName(index, location) {
  const prefixes = ["L’Épicerie", "Le Marché", "Maison Local", "Comptoir Bio", "La Boutique", "Aux Bons Produits", "Le Panier", "Halles Gourmandes", "Côté Terroir", "La Réserve"];
  const suffixes = ["du Centre", "des Voisins", "des Saveurs", "du Quartier", "des Artisans", "de France", "du Terroir", "des Halles", "Local", "Gourmand"];
  return `${pick(prefixes, index)} ${pick(suffixes, index + 5)} - ${location.city}`;
}

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

  const categories = {};

  for (const category of CATEGORIES) {
    const created = await prisma.category.create({ data: category });
    categories[created.name] = created;
  }

  console.log(`✅ ${Object.keys(categories).length} catégories créées`);
  return categories;
}

async function createSuppliers(passwordHash) {
  console.log("🚚 Création massive des fournisseurs...");

  const suppliers = [];

  for (let i = 0; i < SUPPLIER_COUNT; i++) {
    const location = pick(LOCATIONS, i);
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i + 7);
    const name = companyName(i, location);
    const slug = slugify(name);
    const email = `supplier.${String(i + 1).padStart(3, "0")}@kerno-demo.local`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "SUPPLIER",
        firstName,
        lastName,
      },
    });

    const profile = await prisma.supplierProfile.create({
      data: {
        userId: user.id,
        companyName: name,
        description: `${pick(SUPPLIER_TYPES, i)} basé à ${location.city}, proposant une offre professionnelle pour les magasins indépendants, épiceries fines et commerces de proximité.`,
        location: formatLocation(location),
        businessType: pick(SUPPLIER_TYPES, i),
        contactEmail: email,
        phone: phone(location, i + 1),
        website: `https://${slug}.example`,
      },
    });

    suppliers.push({ user, profile });
  }

  console.log(`✅ ${suppliers.length} fournisseurs créés`);
  return suppliers;
}

async function createStores(passwordHash) {
  console.log("🏪 Création massive des magasins...");

  const stores = [];

  for (let i = 0; i < STORE_COUNT; i++) {
    const location = pick(LOCATIONS, i * 2 + 3);
    const firstName = pick(FIRST_NAMES, i + 11);
    const lastName = pick(LAST_NAMES, i + 17);
    const name = storeName(i, location);
    const email = `store.${String(i + 1).padStart(3, "0")}@kerno-demo.local`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "STORE",
        firstName,
        lastName,
      },
    });

    const profile = await prisma.storeProfile.create({
      data: {
        userId: user.id,
        storeName: name,
        brandName: name.split(" - ")[0],
        location: formatLocation(location),
        storeType: pick(STORE_TYPES, i),
        sourcingNeeds: `Recherche de produits locaux, artisanaux et différenciants pour enrichir les rayons ${pick(CATEGORIES, i).name.toLowerCase()} et produits régionaux.`,
        contactEmail: email,
        phone: phone(location, i + 101),
      },
    });

    stores.push({ user, profile });
  }

  console.log(`✅ ${stores.length} magasins créés`);
  return stores;
}

async function createProducts(categories, suppliers) {
  console.log("🛒 Création massive des produits...");

  const products = [];
  const supplierProductMap = new Map();

  for (let supplierIndex = 0; supplierIndex < suppliers.length; supplierIndex++) {
    const supplier = suppliers[supplierIndex].profile;
    const productsForSupplier = [];
    const productCount = 5 + (supplierIndex % (MAX_PRODUCTS_PER_SUPPLIER - 4)); // 5 à 20 produits

    for (let productIndex = 0; productIndex < productCount; productIndex++) {
      const catalogEntry = pick(PRODUCT_CATALOG, supplierIndex + productIndex);
      const productBaseName = pick(catalogEntry.names, supplierIndex * 3 + productIndex);
      const category = categories[catalogEntry.category];
      const unitPrice = (2.2 + ((supplierIndex + productIndex) % 18) * 0.85).toFixed(2).replace(".", ",");
      const minimum = ["12 unités", "24 unités", "36 unités", "48 unités", "5 kg", "10 kg", "1 carton", "2 cartons"][(supplierIndex + productIndex) % 8];

      const product = await prisma.product.create({
        data: {
          supplierId: supplier.id,
          categoryId: category.id,
          name: `${productBaseName} ${supplierIndex + 1}-${productIndex + 1}`,
          description: `${productBaseName} fabriqué par ${supplier.companyName}. Produit pensé pour la revente en boutique, avec une présentation claire et un approvisionnement régulier.`,
          priceInfo: `${unitPrice} € HT / unité`,
          minimumOrder: minimum,
          origin: supplier.location,
          imageUrl: `/assets/products/${slugify(productBaseName)}.webp`,
          isActive: productIndex % 17 !== 0,
        },
      });

      products.push(product);
      productsForSupplier.push(product);
    }

    supplierProductMap.set(supplier.id, productsForSupplier);
  }

  console.log(`✅ ${products.length} produits créés`);
  return { products, supplierProductMap };
}

async function createContactRequests(stores, suppliers, products, supplierProductMap) {
  console.log("✉️ Création massive des demandes de contact...");

  const requests = [];

  for (let i = 0; i < REQUEST_COUNT; i++) {
    const store = stores[i % stores.length].profile;
    const supplier = suppliers[(i * 7 + 3) % suppliers.length].profile;
    const supplierProducts = supplierProductMap.get(supplier.id) || products;
    const product = supplierProducts[i % supplierProducts.length];
    const template = pick(REQUEST_TEMPLATES, i);

    requests.push({
      storeId: store.id,
      supplierId: supplier.id,
      productId: product ? product.id : null,
      subject: `${template.subject} - ${product ? product.name : supplier.companyName}`,
      message: `Bonjour, ${store.storeName} souhaite échanger avec ${supplier.companyName}. Nous voulons connaître vos tarifs, conditions revendeur, délais de livraison et possibilités de commande pour une sélection adaptée à notre clientèle.`,
      requestedQuantity: template.quantity,
      status: template.status,
    });
  }

  const batchSize = 100;
  for (let i = 0; i < requests.length; i += batchSize) {
    await prisma.contactRequest.createMany({
      data: requests.slice(i, i + batchSize),
    });
  }

  console.log(`✅ ${requests.length} demandes de contact créées`);
}

async function main() {
  console.log("🌱 Démarrage du seed massif KERNO...");
  console.log(`🔐 Mot de passe commun : ${DEMO_PASSWORD}`);

  await resetDatabase();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, HASH_ROUNDS);
  const categories = await createCategories();
  const suppliers = await createSuppliers(passwordHash);
  const stores = await createStores(passwordHash);
  const { products, supplierProductMap } = await createProducts(categories, suppliers);

  await createContactRequests(stores, suppliers, products, supplierProductMap);

  console.log("");
  console.log("🎉 Seed massif terminé avec succès !");
  console.log(`👤 Comptes fournisseurs : ${suppliers.length}`);
  console.log(`🏪 Comptes magasins : ${stores.length}`);
  console.log(`📦 Catégories : ${Object.keys(categories).length}`);
  console.log(`🛒 Produits : ${products.length}`);
  console.log(`✉️ Demandes : ${REQUEST_COUNT}`);
  console.log("");
  console.log("Comptes de test :");
  console.log(`- fournisseur : supplier.001@kerno-demo.local / ${DEMO_PASSWORD}`);
  console.log(`- magasin     : store.001@kerno-demo.local / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("❌ Erreur pendant le seed massif :");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });