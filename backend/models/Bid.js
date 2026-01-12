import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      trim: true,
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add your bid price'],
      min: [0, 'Price must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'hired', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bids from same freelancer on same gig
bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
