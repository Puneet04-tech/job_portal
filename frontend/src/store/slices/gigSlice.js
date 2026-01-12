import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get all gigs
export const getGigs = createAsyncThunk(
  'gigs/getGigs',
  async (searchQuery = '', { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/gigs?search=${searchQuery}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs');
    }
  }
);

// Get single gig
export const getGigById = createAsyncThunk(
  'gigs/getGigById',
  async (gigId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/gigs/${gigId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gig');
    }
  }
);

// Create gig
export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/gigs', gigData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig');
    }
  }
);

// Get my gigs
export const getMyGigs = createAsyncThunk(
  'gigs/getMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/gigs/my-gigs');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my gigs');
    }
  }
);

// Delete gig
export const deleteGig = createAsyncThunk(
  'gigs/deleteGig',
  async (gigId, { rejectWithValue }) => {
    try {
      await api.delete(`/gigs/${gigId}`);
      return gigId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete gig');
    }
  }
);

const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    currentGig: null,
    myGigs: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get gigs
      .addCase(getGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs = action.payload;
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get gig by id
      .addCase(getGigById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGigById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGig = action.payload;
      })
      .addCase(getGigById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get my gigs
      .addCase(getMyGigs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = action.payload;
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete gig
      .addCase(deleteGig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGigs = state.myGigs.filter(gig => gig._id !== action.payload);
        state.gigs = state.gigs.filter(gig => gig._id !== action.payload);
      })
      .addCase(deleteGig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentGig } = gigSlice.actions;
export default gigSlice.reducer;
