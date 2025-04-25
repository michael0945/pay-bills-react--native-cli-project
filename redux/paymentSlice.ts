import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import configuration from "../config/configurations";
import AmolePayment from "../services/AmolePayment";
import { RootState } from "./store";
interface PaymentState {
    mobileNumber: string;
    pin: string;
    amount: string;
    pinType: string;
    additionalInfo2: string;
    loading: boolean;
    error: string | null;
    shortMessage: string;
    referenceNumber: string;
    responseAmount: string;
    status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PaymentState = {
    mobileNumber: "",
    pin: "",
    amount: "",
    pinType: "",
    additionalInfo2: "",
    loading: false,
    error: null,
    shortMessage: "",
    referenceNumber: "",
    responseAmount: "",
    status: "idle",
};



export const submitPayment = createAsyncThunk(
    "payment/submitPayment",
    async (_, { getState }) => {
        const state = (getState() as RootState).payment;

        const requestBody = {
            BODY_CardNumber: state.mobileNumber,
            BODY_ExpirationDate: "",
            BODY_PIN: state.pin,
            BODY_PaymentAction: "20",
            BODY_AmountX: state.amount,
            BODY_AmoleMerchantID: configuration.merchantId,
            BODY_OrderDescription: "Airtime top-up purchase",
            BODY_SourceTransID: "test123456787",
            BODY_VendorAccount: "",
            BODY_AdditionalInfo1: state.pinType,
            BODY_AdditionalInfo2: state.additionalInfo2,
            BODY_AdditionalInfo3: "",
            BODY_AdditionalInfo4: "",
            BODY_AdditionalInfo5: "Michaelm",
        };

        const response = await AmolePayment(requestBody);
        return response;
    }
);


const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        mobileNumber: "",
        pin: "",
        amount: "",
        pinType: "",
        additionalInfo2: "",
        loading: false,
        shortMessage: "",
        longMessage: "",
        error: null,
        referenceNumber: "",
        responseAmount: "",
        status: "idle",
    },
    reducers: {
        setMobileNumber: (state, action) => {
            state.mobileNumber = action.payload;
        },
        setAmount: (state, action) => {
            state.amount = action.payload;
        },
        setPinType: (state, action) => {
            state.pinType = action.payload;
        },
        setAdditionalInfo2: (state, action) => {
            state.additionalInfo2 = action.payload;
        },
        setPin: (state, action) => {
            state.pin = action.payload;
        },
        resetForm: (state) => {
            state.mobileNumber = "";
            state.amount = "";
            state.pin = "";
            state.pinType = "";
            state.additionalInfo2 = "";
            state.shortMessage = "";
            state.longMessage = "";
            state.loading = false;
            state.error = null;
            state.referenceNumber = "";
            state.responseAmount = "";


        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(submitPayment.pending, (state) => {
                state.loading = true;
                state.shortMessage = "";
                state.referenceNumber = "";
                state.responseAmount = "";
            })
            .addCase(submitPayment.fulfilled, (state, action) => {
                state.loading = false;
                const firstItem = action.payload;
                state.shortMessage = firstItem.MSG_ShortMessage;
                state.referenceNumber = firstItem.HDR_ReferenceNumber;
                state.responseAmount = firstItem.BODY_Amount;
            })
            .addCase(submitPayment.rejected, (state, action) => {
                state.status = "failed";
                state.loading = false;
                state.error = action.payload as string | null;
                state.longMessage = action.payload as string;
            })

    },
});

export const {
    setMobileNumber,
    setAmount,
    setPinType,
    setAdditionalInfo2,
    resetForm,
    setPin,
} = paymentSlice.actions;

export default paymentSlice.reducer;
