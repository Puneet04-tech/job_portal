import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Create bid
export const createBid = createAsyncThunk(
  'bids/createBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/bids', bidData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bid');
    }
  }
);

// Get bids for a gig (owner only)
export const getBidsForGig = createAsyncThunk(
  'bids/getBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/bids/gig/${gigId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids');
    }
  }
);

// Get my bids
export const getMyBids = createAsyncThunk(
  'bids/getMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bids/my-bids');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my bids');
    }
  }
);

// Hire a bid
export const hireBid = createAsyncThunk(
  'bids/hireBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/bids/${bidId}/hire`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer');
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Bid submitted successfully';
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get bids for gig
      .addCase(getBidsForGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBidsForGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload;
      })
      .addCase(getBidsForGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my bids
      .addCase(getMyBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBids = action.payload;
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = 'Freelancer hired successfully';
        // Update the bids list
        state.bids = state.bids.map((bid) =>
          bid._id === action.payload.bid._id
            ? { ...bid, status: 'hired' }
            : bid.status === 'pending'
            ? { ...bid, status: 'rejected' }
            : bid
        );
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = bidSlice.actions;
export default bidSlice.reducer;
