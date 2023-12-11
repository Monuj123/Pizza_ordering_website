import express from "express";

import {
  registerController,
  loginController,
  userController,
  refreshController,
} from "../controllers/index.js";

import auth from "../middlewares/auth.js";
import productController from "../controllers/productController.js";
import admin from "../middlewares/admin.js";

const router = express.Router();
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

router.post("/product", [auth, admin], productController.store);
router.put("/product/:id", [auth, admin], productController.update);
router.delete("/product/:id", [auth, admin], productController.destroy);
router.get("/product", productController.index);
router.get("/product/:id", productController.show);

export default router;
