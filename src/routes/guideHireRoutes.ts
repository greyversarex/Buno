import { Router } from 'express';
import {
  getGuideAvailability,
  updateGuideAvailability,
  createGuideHireRequest,
  getGuideHireRequests,
  updateGuideHireRequestStatus,
  getAvailableGuides
} from '../controllers/guideHireController';
import { adminAuthMiddleware } from '../controllers/adminController';

const router = Router();

// Публичные endpoints (доступны без авторизации)
router.get('/available', getAvailableGuides);
router.get('/:guideId/availability', getGuideAvailability);
router.post('/hire-request', createGuideHireRequest);

// Endpoints для тургидов (требуют авторизации тургида)
// Пока используем админ авторизацию, позже добавим отдельную для тургидов
router.put('/:guideId/availability', adminAuthMiddleware, updateGuideAvailability);

// Административные endpoints (требуют авторизации администратора)
router.get('/hire-requests', adminAuthMiddleware, getGuideHireRequests);
router.put('/hire-requests/:requestId/status', adminAuthMiddleware, updateGuideHireRequestStatus);

export default router;