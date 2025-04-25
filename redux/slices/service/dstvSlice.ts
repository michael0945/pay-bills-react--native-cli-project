import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

interface DSTVState {
    amountDue: string | null;
    line1: string | null;
    line2: string | null;
    line3: string | null;
    line4: string | null;
    line5: string | null;
    line6: string | null;
    shortMessage: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    longMessage: string | null;
}

const initialState: DSTVState = {
    amountDue: null,
    line1: null,
    line2: null,
    line3: null,
    line4: null,
    line5: null,
    line6: null,
    shortMessage: null,
    status: "idle",
    error: null,
    longMessage: null,
};

interface DSTVResponse {
    AmountDue: string;
    Line1: string;
    Line2: string;
    Line3: string;
    Line4: string;
    Line5: string;
    Line6: string;
    shortMessage: string;
    longMessage: string;

}

export const fetchDSTVData = createAsyncThunk<DSTVResponse, string>(
    "dstv/fetchDSTVData",
    async (smartCardNumber) => {
        const url = "http://uatc.api.myamole.com:8075/amole/service";
        const data = qs.stringify({
            BODY_ServiceRequest: `<Service>DSTVBillLookup</Service><SmartCardNumber>${smartCardNumber}</SmartCardNumber>`,
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

        console.log(" API Response:", response.data);
        const responseData = response.data[0];
        if (responseData.MSG_ShortMessage !== "Success") {
            throw new Error(responseData.MSG_LongMessage || "Failed to fetch data");
        }
        if (!responseData.BODY_ServiceResponse) {
            throw new Error("No service response found");
        }

        const parsedBody = JSON.parse(response.data[0].BODY_ServiceResponse);

        return {
            AmountDue: parsedBody.AmountDue,
            Line1: parsedBody.Line1,
            Line2: parsedBody.Line2,
            Line3: parsedBody.Line3,
            Line4: parsedBody.Line4,
            Line5: parsedBody.Line5,
            Line6: parsedBody.Line6,
            shortMessage: response.data[0].MSG_ShortMessage,
            longMessage: response.data[0].MSG_LongMessage,
        };
    }
);

export const clearDSTVState = createAction("dstv/clear");

const dstvSlice = createSlice({
    name: "dstv",
    initialState,
    reducers: {
        resetDstvLookup(state) {
            state.amountDue = null;
            state.line1 = null;
            state.line2 = null;
            state.line3 = null;
            state.line4 = null;
            state.line5 = null;
            state.line6 = null;
            state.shortMessage = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearDSTVState, () => initialState)
            .addCase(fetchDSTVData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchDSTVData.fulfilled,
                (state, action: PayloadAction<DSTVResponse>) => {
                    state.status = "succeeded";
                    state.amountDue = action.payload.AmountDue;
                    state.line1 = action.payload.Line1;
                    state.line2 = action.payload.Line2;
                    state.line3 = action.payload.Line3;
                    state.line4 = action.payload.Line4;
                    state.line5 = action.payload.Line5;
                    state.line6 = action.payload.Line6;
                    state.shortMessage = action.payload.shortMessage;
                }
            )
            .addCase(fetchDSTVData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Something went wrong";
                state.longMessage = action.error.message || "Something went wrong";
                state.amountDue = null;
            });
    },
});

export const { resetDstvLookup } = dstvSlice.actions;
export default dstvSlice.reducer;


