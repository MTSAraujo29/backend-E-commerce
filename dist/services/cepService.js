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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressByCep = void 0;
const axios_1 = __importDefault(require("axios"));
const getAddressByCep = (cep) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove caracteres não numéricos do CEP
        const cleanCep = cep.replace(/\D/g, '');
        // Verifica se o CEP tem 8 dígitos
        if (cleanCep.length !== 8) {
            throw new Error('CEP inválido. O CEP deve conter 8 dígitos.');
        }
        // Faz a requisição para a API ViaCEP
        const response = yield axios_1.default.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        // Verifica se a resposta contém erro
        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            throw new Error(`Erro ao consultar CEP: ${error.message}`);
        }
        throw error;
    }
});
exports.getAddressByCep = getAddressByCep;
//# sourceMappingURL=cepService.js.map