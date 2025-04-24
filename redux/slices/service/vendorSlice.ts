import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as qs from "qs";

interface VendorState {
  vendorCodes: string[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendorCodes: [],
  loading: false,
  error: null,
};

export const fetchVendors = createAsyncThunk("vendors/fetchVendors", async () => {
  const url = "http://uatc.api.myamole.com:8075/amole/service";
  const data = qs.stringify({
    BODY_ServiceRequest: "<Service>BillVendors</Service><Language>AM</Language>",
  });

  const response = await axios.post(url, data, {
    headers: {
      HDR_Signature: "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
      HDR_IPAddress: "0.0.0.0",
      HDR_UserName: "mpos",
      HDR_Password: "test",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  let custData: string = response.data[0].BODY_ServiceResponse;
  const obj = JSON.parse(custData);

  if (obj.BillVendors) {
    return obj.BillVendors.map((vendor: { VendorCode: string }) => vendor.VendorCode);
  } else {
    throw new Error("No vendors found");
  }
});

const vendorSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorCodes = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vendors";
      });
  },
});

export default vendorSlice.reducer;
