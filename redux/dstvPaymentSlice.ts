import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import AmolePayment from "../services/AmolePayment";
import configuration from "../config/configurations";


interface DSTVPaymentState {
    cardNumber: string;
    pinDp: string;
    vendorAccount: string;
    amountDue: string;
    shortMessage: string | null;
    referenceNumber: string | null;
    amount: string | null;
    loading: boolean;
    error: string | null;
    longMessage: string | null;
    bcardNumber: string | null;
    MSG_ErrorCode: string | null

    status: "idle" | "loading" | "succeeded" | "failed";


}

const initialState: DSTVPaymentState = {
    cardNumber: "",
    pinDp: "",
    vendorAccount: "",
    amountDue: "",
    shortMessage: null,
    referenceNumber: null,
    amount: null,
    loading: false,
    error: null,
    longMessage: null,
    bcardNumber: null,

    status: "idle",
    MSG_ErrorCode: null

};

export const fetchDSTVPayment = createAsyncThunk(
    "dstvPayment/fetchDSTVPayment",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { cardNumber, pinDp, vendorAccount, amountDue } = state.dstvPayment;

        const requestBody = {
            BODY_CardNumber: cardNumber,
            BODY_ExpirationDate: "",
            BODY_PIN: pinDp,
            BODY_PaymentAction: "31",
            BODY_AmountX: amountDue,
            BODY_AmoleMerchantID: configuration.merchantId,
            BODY_OrderDescription: "DStv payment",
            BODY_SourceTransID: "test123456789",
            BODY_VendorAccount: vendorAccount,
            BODY_AdditionalInfo1: "DSTV",
            BODY_AdditionalInfo2: "",
            BODY_AdditionalInfo3: "1",
            BODY_AdditionalInfo4: "",
            BODY_AdditionalInfo5: "Michaelm",
        };

        try {
            const response = await AmolePayment(requestBody);
            console.log("API Response:", response);

            return {
                longMessage: response.MSG_LongMessage,
                shortMessage: response.MSG_ShortMessage,
                referenceNumber: response.HDR_ReferenceNumber,
                amount: response.BODY_Amount,
                bcardNumber: response.BODY_CardNumber || response.CARD_Number || null,
                MSG_ErrorCode: response.MSG_ErrorCode

            };
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
export const clearDstvPaymentState = createAction("dstvPayment/clear");

const dstvPaymentSlice = createSlice({
    name: "dstvPayment",
    initialState,
    reducers: {
        setCardNumber: (state, action: PayloadAction<string>) => {
            state.cardNumber = action.payload;
        },
        setPinDp: (state, action: PayloadAction<string>) => {
            state.pinDp = action.payload;
        },
        setVendorAccount: (state, action: PayloadAction<string>) => {
            state.vendorAccount = action.payload;
        },
        setAmountDue: (state, action: PayloadAction<string>) => {
            state.amountDue = action.payload;
        },
        resetPaymentState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearDstvPaymentState, () => initialState)
            .addCase(fetchDSTVPayment.pending, (state) => {
                state.status = "loading";
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDSTVPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.shortMessage = action.payload.shortMessage;
                state.referenceNumber = action.payload.referenceNumber;
                state.amount = action.payload.amount;
                state.bcardNumber = action.payload.bcardNumber;
                state.MSG_ErrorCode = action.payload.MSG_ErrorCode
                state.longMessage = action.payload.longMessage
            })
            .addCase(fetchDSTVPayment.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.payload as string;
                state.longMessage = action.payload as string;
            });
    },
});

export const {
    setCardNumber,
    setPinDp,
    setVendorAccount,
    setAmountDue,
    resetPaymentState,
} = dstvPaymentSlice.actions;

export default dstvPaymentSlice.reducer;
