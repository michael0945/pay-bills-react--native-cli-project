import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import AmoleServices from "../services/AmoleServices";


type Vendor = "WEBSPRIX" | "GUZOGO" | "WEBIRR" | "ETHSWITCH" | "LIYUBUS" | "ETAIRFLY";

interface BillLookupState {
    data: {
        firstName?: string;
        gender?: string;
        phoneNumber?: string;
        amount?: string;
        fee?: string;
        totalAmount?: string;
    };
    error: string | null;
    loading: boolean;
    vendor: Vendor | null;
}

const initialState: BillLookupState = {
    data: {
        firstName: "",
        gender: "",
        phoneNumber: "",
        amount: "",
        fee: "",
        totalAmount: "",
    },
    error: null,
    loading: false,
    vendor: null,
};

interface BillLookupArgs {
    keyValue: string;
    vendor: Vendor;
}

export const fetchBillLookupData = createAsyncThunk(
    "billLookup/fetchBillLookupData",
    async ({ keyValue, vendor }: BillLookupArgs, { rejectWithValue }) => {
        const serviceMap: Record<Vendor, string> = {
            WEBSPRIX: "WebSprixBillLookup",
            GUZOGO: "GuzoGoPNRLookup",
            WEBIRR: "WeBirrBillLookup",
            ETHSWITCH: "EthSwitchBillLookup",
            LIYUBUS: "LiyuBusBillLookup",
            ETAIRFLY: "ETAirFlyBillLookup",
        };

        const requestBody = {
            BODY_ServiceRequest: `<Service>${serviceMap[vendor]}</Service><KeyValue>${keyValue}</KeyValue>`,
        };

        try {
            const res: AxiosResponse = await AmoleServices(requestBody);
            const response = res.data[0].BODY_ServiceResponse;
            if (response) {
                const obj = JSON.parse(response);
                return {
                    vendor,
                    data: {
                        firstName: obj.Line3,
                        gender: obj.Line1,
                        phoneNumber: obj.Line2,
                        amount: obj.AmountDue,
                        fee: obj.Line5,
                        totalAmount: obj.Line6,
                    },
                };
            } else {
                return rejectWithValue("Empty response");
            }
        } catch (error) {
            return rejectWithValue("API request failed");
        }
    }
);

export const clearBilllookupState = createAction("billLookup/clear");

const billLookupSlice = createSlice({
    name: "billLookup",
    initialState,
    reducers: {
        clearBillLookup: (state) => {
            state.data = initialState.data;
            state.error = null;
            state.loading = false;
            state.vendor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearBilllookupState, () => initialState)
            .addCase(fetchBillLookupData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBillLookupData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.vendor = action.payload.vendor;
            })
            .addCase(fetchBillLookupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearBillLookup } = billLookupSlice.actions;
export default billLookupSlice.reducer;
