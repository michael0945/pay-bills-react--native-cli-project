import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import AmoleServices from "../services/AmoleServices";
import { AxiosError, AxiosResponse } from "axios";

interface AggrigatorState {
    billerID: string;
    billID: string;
    amountDue: string;
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    line5: string;
    line6: string;
    line7: string;
    line8: string;
    line9: string;
    loading: boolean;
    error: string | null;
    longMessage: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AggrigatorState = {
    billerID: "",
    billID: "",
    amountDue: "",
    line1: "",
    line2: "",
    line3: "",
    line4: "",
    line5: "",
    line6: "",
    line7: "",
    line8: "",
    line9: "",
    loading: false,
    error: null,
    longMessage: null,
    status: "idle"
};

interface FetchBillArgs {
    billerID: string;
    billID: string;
}

export const fetchBillDetails = createAsyncThunk(
    "aggrigator/fetchBillDetails",
    async ({ billerID, billID }: FetchBillArgs, thunkAPI) => {
        const requestBody = {
            BODY_ServiceRequest: `<Service>DerashBillLookup</Service><BillerID>${billerID}</BillerID><BillID>${billID}</BillID><Language>en</Language>`,
        };

        try {
            const response: AxiosResponse = await AmoleServices(requestBody);
            const responseData = response.data[0]

            console.log("✅ API Response:", responseData);

            const serviceResponse = responseData.BODY_ServiceResponse;
            const longMessage = responseData.MSG_LongMessage;
            const acknowledge = responseData.HDR_Acknowledge;

            if (acknowledge === "Failure") {
                return thunkAPI.rejectWithValue(longMessage || "Bill lookup failed");
            }

            if (serviceResponse) {
                const parsedData = JSON.parse(serviceResponse);
                return {
                    ...parsedData,
                    MSG_LongMessage: longMessage,
                };
            } else {
                return thunkAPI.rejectWithValue("Empty response data");
            }
        } catch (error) {


            return thunkAPI.rejectWithValue("Failed to fetch data from the API");
        }
    }
);

export const clearBilllookupState = createAction("aggrigator/clear");

const aggrigatorSlice = createSlice({
    name: "aggrigator",
    initialState,
    reducers: {
        setBillerID: (state, action: PayloadAction<string>) => {
            state.billerID = action.payload;
        },
        setBillID: (state, action: PayloadAction<string>) => {
            state.billID = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearBilllookupState, () => initialState)
            .addCase(fetchBillDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.longMessage = null;
                state.status = "loading";
            })
            .addCase(fetchBillDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.longMessage = action.payload.MSG_LongMessage || null;
                state.amountDue = action.payload.AmountDue || "";
                state.line1 = action.payload.Line1 || "";
                state.line2 = action.payload.Line2 || "";
                state.line3 = action.payload.Line3 || "";
                state.line4 = action.payload.Line4 || "";
                state.line5 = action.payload.Line5 || "";
                state.line6 = action.payload.Line6 || "";
                state.line7 = action.payload.Line7 || "";
                state.line8 = action.payload.Line8 || "";
                state.line9 = action.payload.Line9 || "";
            })
            .addCase(fetchBillDetails.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.payload as string;
                state.longMessage = action.payload as string;
            });
    },
});

export const { setBillerID, setBillID } = aggrigatorSlice.actions;
export default aggrigatorSlice.reducer;