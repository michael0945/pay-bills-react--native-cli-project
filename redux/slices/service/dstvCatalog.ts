import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import qs from "qs";

interface DstvCatalogProduct {
    Product: string;
    ProductCode: string;
    MonthlyPrice: string;
    YearlyPrice: string;
}

interface DstvStateCatalog {
    Product: string;
    catalog: DstvCatalogProduct[];
    loading: boolean;
    shortMessage: string | null;
    longMessage: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: DstvStateCatalog = {
    Product: "",
    catalog: [],
    loading: false,
    error: null,
    status: "idle",
    shortMessage: null,
    longMessage: null,
};

export const fetchDstvCatalog = createAsyncThunk(
    "dstvCatalog/fetchCatalog",
    async () => {
        const url = "http://uatc.api.myamole.com:8075/amole/service";
        const data = qs.stringify({
            BODY_ServiceRequest: "<Service>DStvCatalog</Service>",
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

        const responseData = response.data[0];

        if (responseData.MSG_ShortMessage !== "Success") {
            throw new Error(responseData.MSG_LongMessage || "Failed to fetch data");
        }

        if (!responseData.BODY_ServiceResponse) {
            throw new Error("No service response found");
        }

        const parsed = JSON.parse(responseData.BODY_ServiceResponse);

        return {
            catalog: parsed.DStvCatalog as DstvCatalogProduct[],
            shortMessage: responseData.MSG_ShortMessage,
            longMessage: responseData.MSG_LongMessage,
        };
    }
);

export const clearDSTVCatalog = createAction("dstvCatalog/clear");

const dstvCatalogSlice = createSlice({
    name: "dstvCatalog",
    initialState,
    reducers: {
        resetDstvCatalog(state) {
            state.catalog = [];
            state.loading = false;
            state.error = null;
            state.shortMessage = null;
            state.longMessage = null;
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearDSTVCatalog, () => initialState)
            .addCase(fetchDstvCatalog.pending, (state) => {
                state.status = "loading";
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDstvCatalog.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.loading = false;
                state.catalog = action.payload.catalog;
                state.shortMessage = action.payload.shortMessage;
                state.longMessage = action.payload.longMessage;
            })
            .addCase(fetchDstvCatalog.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
                state.longMessage = action.error.message || "Something went wrong";
            });
    },
});

export const { resetDstvCatalog } = dstvCatalogSlice.actions;
export default dstvCatalogSlice.reducer;
