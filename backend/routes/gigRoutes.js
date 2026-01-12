import express from 'express';
import {
  getGigs,
  getGigById,
  createGig,
  getMyGigs,
  deleteGig,
} from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getGigs).post(protect, createGig);
router.get('/my-gigs', protect, getMyGigs);
router.route('/:id').get(getGigById).delete(protect, deleteGig);

export default router;
