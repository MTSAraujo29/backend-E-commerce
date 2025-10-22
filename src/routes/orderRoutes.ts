import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Todas as rotas de pedidos são protegidas
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;