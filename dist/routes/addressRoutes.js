"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const router = (0, express_1.Router)();
// Rota para buscar endereço por CEP
router.get('/:cep', addressController_1.getAddress);
exports.default = router;
//# sourceMappingURL=addressRoutes.js.map