import qs from "qs";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface GuzoGoState {
    firstName?: string;
    gender?: string;
    phoneNumber?: string;
    amount?: string;
    fee?: string;
    totalAmount?: string;
    error?: string | null;
    loading: boolean;
}

const initialState: GuzoGoState = {
    firstName: "",
    gender: "",
    phoneNumber: "",
    amount: "",
    fee: "",
    totalAmount: "",
    error: null,
    loading: false,
};

export const fetchGuzogoData = createAsyncThunk(
    "guzoGo/fetchGuzogoData",
    async (keyValue: string, { rejectWithValue }) => {
        const url = "http://uatc.api.myamole.com:8075/amole/service";
        const data = qs.stringify({
            BODY_ServiceRequest: `<Service>GuzoGoPNRLookup</Service><KeyValue>${keyValue}</KeyValue>`,
        });

        try {
            const res = await axios.post(url, data, {
                headers: {
                    HDR_Signature: "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
                    HDR_IPAddress: "0.0.0.0",
                    HDR_UserName: "mpos",
                    HDR_Password: "test",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const response = res.data[0].BODY_ServiceResponse;

            if (response) {
                const obj = JSON.parse(response);
                return {
                    firstName: obj.Line3,
                    gender: obj.Line1,
                    phoneNumber: obj.Line2,
                    amount: obj.AmountDue,
                    fee: obj.Line5,
                    totalAmount: obj.Line6,
                };
            } else {
                return rejectWithValue("Empty response");
            }
        } catch (error) {
            return rejectWithValue("API request failed");
        }
    }
);

const guzoGoSlice = createSlice({
    name: "guzoGo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGuzogoData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuzogoData.fulfilled, (state, action) => {
                state.loading = false;
                state.firstName = action.payload.firstName;
                state.gender = action.payload.gender;
                state.phoneNumber = action.payload.phoneNumber;
                state.amount = action.payload.amount;
                state.fee = action.payload.fee;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(fetchGuzogoData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default guzoGoSlice.reducer;


