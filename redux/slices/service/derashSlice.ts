import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

interface Biller {
    BillerID: string;
    Name: string;
    [key: string]: any;
}

interface DerashState {
    billers: Biller[];
    loading: boolean;
    error: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DerashState = {
    billers: [],
    loading: false,
    error: null,
    status: "idle"
};

export const fetchDerashBillers = createAsyncThunk(
    "derash/fetchBillers",
    async (_, thunkAPI) => {
        const url = "http://uatc.api.myamole.com:8075/amole/service";
        const data = qs.stringify({
            BODY_ServiceRequest: "<Service>DerashBillers</Service>",
        });

        try {
            const res = await axios.post(url, data, {
                headers: {
                    HDR_Signature:
                        "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
                    HDR_IPAddress: "0.0.0.0",
                    HDR_UserName: "mpos",
                    HDR_Password: "test",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const responseBody = res.data?.[0]?.BODY_ServiceResponse;
            const parsedData = JSON.parse(responseBody);
            return parsedData.DerashBillers;
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to fetch billers.");
        }
    }
);

const derashSlice = createSlice({
    name: "derash",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDerashBillers.pending, (state) => {
                state.status = "loading";
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDerashBillers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.loading = false;
                state.billers = action.payload;
            })
            .addCase(fetchDerashBillers.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default derashSlice.reducer;
