const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const usersRoutes = require("../modules/users/users.routes");
const suppliersRoutes = require("../modules/suppliers/suppliers.routes");
const storesRoutes = require("../modules/stores/stores.routes");
const productsRoutes = require("../modules/products/products.routes");
const categoriesRoutes = require("../modules/categories/categories.routes");
const requestsRoutes = require("../modules/requests/requests.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/stores", storesRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/requests", requestsRoutes);

module.exports = router;
