"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Todas as rotas de pedidos são protegidas
router.use(authMiddleware_1.protect);
router.post('/', orderController_1.createOrder);
router.get('/', orderController_1.getUserOrders);
router.get('/:id', orderController_1.getOrderById);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map