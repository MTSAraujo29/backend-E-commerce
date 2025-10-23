"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = void 0;
const cepService_1 = require("../services/cepService");
const getAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cep } = req.params;
        if (!cep) {
            res.status(400).json({ message: 'CEP é obrigatório' });
            return;
        }
        const addressData = yield (0, cepService_1.getAddressByCep)(cep);
        res.status(200).json(addressData);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Erro ao buscar endereço' });
        }
    }
});
exports.getAddress = getAddress;
//# sourceMappingURL=addressController.js.map