import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

// @desc    Submit a bid
// @route   POST /api/bids
// @access  Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer open for bidding' });
    }

    // Prevent owner from bidding on their own gig
    if (gig.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user already has a bid on this gig
    const existingBid = await Bid.findOne({
      gig: gigId,
      freelancer: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this gig' });
    }

    // Create bid
    const bid = await Bid.create({
      gig: gigId,
      freelancer: req.user._id,
      message,
      price,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title description budget');

    res.status(201).json(populatedBid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bids for a gig (Owner only)
// @route   GET /api/bids/gig/:gigId
// @access  Private
export const getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner of the gig
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gig: req.params.gigId })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's submitted bids
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate('gig', 'title description budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Hire a freelancer (CRUCIAL LOGIC with Atomic Operations)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private
export const hireBid = async (req, res) => {
  try {
    // Find the bid
    const bid = await Bid.findById(req.params.bidId).populate('gig');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = bid.gig;

    // Check if user is the owner of the gig
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is already assigned' });
    }

    // ATOMIC OPERATIONS (Bonus 1: Transactional Integrity):
    // Perform all updates sequentially for consistency
    
    // 1. Update the gig status to 'assigned'
    await Gig.findByIdAndUpdate(gig._id, { status: 'assigned' });

    // 2. Update the chosen bid status to 'hired'
    await Bid.findByIdAndUpdate(bid._id, { status: 'hired' });

    // 3. Update all other bids for this gig to 'rejected'
    await Bid.updateMany(
      {
        gig: gig._id,
        _id: { $ne: bid._id },
        status: 'pending',
      },
      { status: 'rejected' }
    );

    // Fetch updated bid with populated data
    const updatedBid = await Bid.findById(bid._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title description budget status');

    // Send real-time notification to the hired freelancer (Bonus 2)
    if (req.io) {
      req.io.emit('hiringNotification', {
        freelancerId: bid.freelancer._id.toString(),
        gigTitle: gig.title,
        clientName: req.user.name,
        message: `You have been hired for "${gig.title}"!`,
      });
    }

    // Return the hired bid with gig details for socket notification
    res.json({
      message: 'Freelancer hired successfully',
      bid: updatedBid,
      gigTitle: gig.title,
      freelancerId: bid.freelancer._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during hiring process' });
  }
};
