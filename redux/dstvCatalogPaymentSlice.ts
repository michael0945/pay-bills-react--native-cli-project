import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import AmolePayment from "../services/AmolePayment";
import configuration from "../config/configurations";
import { clearDSTVCatalog } from "./slices/service/dstvCatalog";


interface DSTVCatalogPaymentState {
    cardNumberC: string;
    pinDpC: string;
    vendorAccountC: string;
    amountDueC: string;
    shortMessage: string | null;
    referenceNumber: string | null;
    productCode: string | null;
    month: string | null;
    amount: string | null;
    loading: boolean;
    error: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    CcardNumber: string | null;
    MSG_ErrorCode: string | null
    longMessage: string | null;

}

const initialState: DSTVCatalogPaymentState = {
    cardNumberC: "",
    pinDpC: "",
    vendorAccountC: "",
    amountDueC: "",
    shortMessage: null,
    referenceNumber: null,
    productCode: null,
    month: null,
    amount: null,
    loading: false,
    error: null,
    status: "idle",
    CcardNumber: null,
    longMessage: null,
    MSG_ErrorCode: null
};

export const fetchDSTVCatalogPayment = createAsyncThunk(
    "dstvCatalogPayment/fetchDSTVCatalogPayment",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const {
            cardNumberC,
            pinDpC,
            vendorAccountC,
            amountDueC,
            productCode,
            month,
        } = state.dstvCatalogPayment;

        const requestBody = {
            BODY_CardNumber: cardNumberC,
            BODY_ExpirationDate: "",
            BODY_PIN: pinDpC,
            BODY_PaymentAction: "31",
            BODY_AmountX: amountDueC,
            BODY_AmoleMerchantID: configuration.merchantId,
            BODY_OrderDescription: "DStv payment",
            BODY_SourceTransID: "test123456789",
            BODY_VendorAccount: vendorAccountC,
            BODY_AdditionalInfo1: "DSTV",
            BODY_AdditionalInfo2: productCode,
            BODY_AdditionalInfo3: month,
            BODY_AdditionalInfo4: "",
            BODY_AdditionalInfo5: "Michaelm",
        };

        try {
            const response = await AmolePayment(requestBody);
            console.log("API Response:", response);
            return {
                shortMessage: response.MSG_ShortMessage,
                referenceNumber: response.HDR_ReferenceNumber,
                amount: response.BODY_Amount,
                CcardNumber: response.BODY_CardNumber || response.CARD_Number || null,
                longMessage: response.MSG_LongMessage,
                MSG_ErrorCode: response.MSG_ErrorCode

            };
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
export const cleardstvCatalogPaymentState = createAction("dstvCatalogPayment/clear");

const dstvCatalogPaymentSlice = createSlice({
    name: "dstvCatalogPayment",
    initialState,
    reducers: {
        setCardNumberC: (state, action: PayloadAction<string>) => {
            state.cardNumberC = action.payload;
        },
        setPinDpC: (state, action: PayloadAction<string>) => {
            state.pinDpC = action.payload;
        },
        setVendorAccountC: (state, action: PayloadAction<string>) => {
            state.vendorAccountC = action.payload;
        },
        setAmountDueC: (state, action: PayloadAction<string>) => {
            state.amountDueC = action.payload;
        },
        setProductCode: (state, action: PayloadAction<string>) => {
            state.productCode = action.payload;
        },
        setMonth: (state, action: PayloadAction<string>) => {
            state.month = action.payload;
        },
        resetCatalogPaymentState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(cleardstvCatalogPaymentState, () => initialState)
            .addCase(fetchDSTVCatalogPayment.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchDSTVCatalogPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.shortMessage = action.payload.shortMessage;
                state.referenceNumber = action.payload.referenceNumber;
                state.amount = action.payload.amount;
                state.CcardNumber = action.payload.CcardNumber;
                state.MSG_ErrorCode = action.payload.MSG_ErrorCode
                state.longMessage = action.payload.longMessage
            })
            .addCase(fetchDSTVCatalogPayment.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload as string;
                state.longMessage = action.payload as string;
            });
    },
});

export const {
    setCardNumberC,
    setPinDpC,
    setVendorAccountC,
    setAmountDueC,
    setProductCode,
    setMonth,
    resetCatalogPaymentState,
} = dstvCatalogPaymentSlice.actions;

export default dstvCatalogPaymentSlice.reducer;

