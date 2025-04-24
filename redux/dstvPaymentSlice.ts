import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
                shortMessage: response.MSG_ShortMessage,
                referenceNumber: response.HDR_ReferenceNumber,
                amount: response.BODY_Amount,
            };
        } catch (error: any) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

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
            .addCase(fetchDSTVPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDSTVPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.shortMessage = action.payload.shortMessage;
                state.referenceNumber = action.payload.referenceNumber;
                state.amount = action.payload.amount;
            })
            .addCase(fetchDSTVPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
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
