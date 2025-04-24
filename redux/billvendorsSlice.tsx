import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AmoleServices from "../services/AmoleServices";


interface BillVendor {
  id: string;
  name: string;
}


interface BillVendorsState {
  billVendors: BillVendor[];
  loading: boolean;
  error: string | null;
}


const initialState: BillVendorsState = {
  billVendors: [],
  loading: false,
  error: null,
};


export const fetchBillVendors = createAsyncThunk<BillVendor[], void>(
  "billVendors/fetchBillVendors",
  async (_, { rejectWithValue }) => {
    try {
      const requestData = {
        BODY_ServiceRequest: "<Service>BillVendors</Service><Language>AM</Language>",
      };


      const response = await AmoleServices(requestData);

      const responseData = response.data?.[0]?.BODY_ServiceResponse;

      const parsedData = JSON.parse(responseData);

      if (parsedData && Array.isArray(parsedData.BillVendors)) {
        return parsedData.BillVendors as BillVendor[];
      } else {
        return rejectWithValue("Invalid response format: No 'BillVendors' array found.");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Error fetching bill vendors.");
    }
  }
);



const billVendorsSlice = createSlice({
  name: "billVendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillVendors.fulfilled, (state, action: PayloadAction<BillVendor[]>) => {
        state.loading = false;
        state.billVendors = action.payload;
      })
      .addCase(fetchBillVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default billVendorsSlice.reducer;
