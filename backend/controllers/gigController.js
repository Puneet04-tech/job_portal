import Gig from '../models/Gig.js';

// @desc    Get all gigs with search
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    // Filter by status (default to 'open')
    query.status = status || 'open';

    // Search by title if search query exists
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const gigs = await Gig.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('owner', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      owner: req.user._id,
    });

    const populatedGig = await Gig.findById(gig._id).populate('owner', 'name email');

    res.status(201).json(populatedGig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's posted gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    await gig.deleteOne();
    res.json({ message: 'Gig removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
