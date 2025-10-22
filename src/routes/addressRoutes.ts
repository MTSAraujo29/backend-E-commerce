import { Router } from 'express';
import { getAddress } from '../controllers/addressController';

const router = Router();

// Rota para buscar endereço por CEP
router.get('/:cep', getAddress);

export default router;