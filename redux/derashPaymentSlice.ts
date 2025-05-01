import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import AmolePayment from '../services/AmolePayment';
import { set } from 'react-hook-form';

interface DerashPaymentState {
    loading: boolean;
    error: string | null;
    shortMessage: string | null;
    referenceNumber: string | null;
    amount: string | null;
    longMessage?: string | null;
    cardNumberD?: string;
    pinD?: string;
    vendorAccountD?: string;
    amountD?: string;
    additionalInfo2D?: string;
    status: "idle" | "loading" | "succeeded" | "failed";



}

interface PaymentPayload {
    cardNumber: string;
    amount: string;
    vendorAccount: string;
    additionalInfo2: string;
}

const initialState: DerashPaymentState = {
    loading: false,
    error: null,
    shortMessage: null,
    referenceNumber: null,
    amount: null,
    longMessage: null,
    cardNumberD: '',
    pinD: '',
    vendorAccountD: '',
    amountD: '',
    additionalInfo2D: '',
    status: "idle",

};

export const fetchDerashPayment = createAsyncThunk(
    'derashPayment/fetchDerashPayment',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { cardNumberD, pinD, vendorAccountD, amountD, additionalInfo2D } = state.derashPayment;
        console.log("State:", state.derashPayment);
        console.log("Card Number:", cardNumberD);
        console.log("PIN:", pinD);
        console.log("Vendor Account:", vendorAccountD);
        console.log("Amount:", amountD);
        console.log("Additional Info 2:", additionalInfo2D);




        const requestBody = {
            BODY_CardNumber: cardNumberD,
            BODY_ExpirationDate: '',
            BODY_PIN: pinD,
            BODY_PaymentAction: '31',
            BODY_AmountX: amountD,
            BODY_AmoleMerchantID: 'FETTANMPOS',
            BODY_OrderDescription: '',
            BODY_SourceTransID: '',
            BODY_VendorAccount: vendorAccountD,
            BODY_AdditionalInfo1: 'DERASH',
            BODY_AdditionalInfo2: additionalInfo2D,
            BODY_AdditionalInfo3: '0945098040',
            BODY_AdditionalInfo4: '',
            BODY_AdditionalInfo5: 'Michaelm',
        };
        try {
            const response = await AmolePayment(requestBody)
            console.log("API Response:", response);
            return {
                longMessage: response.MSG_LongMessage,
                shortMessage: response.MSG_ShortMessage,
                referenceNumber: response.HDR_ReferenceNumber,
                amountD: response.BODY_Amount,
            }
        } catch (error: any) {
            console.error("Error in AmolePayment:", error.message);
            return rejectWithValue(error.message || 'Something went wrong');

        }





    }
);
export const clearDerashPaymentState = createAction("derashPayment/clear");

const derashPaymentSlice = createSlice({
    name: 'derashPayment',
    initialState,
    reducers: {
        setCardNumberD: (state, action: PayloadAction<string>) => {
            state.cardNumberD = action.payload;
        },
        setPinDpD: (state, action: PayloadAction<string>) => {
            state.pinD = action.payload;
        },
        setVendorAccountD: (state, action: PayloadAction<string>) => {
            state.vendorAccountD = action.payload;
        },
        setAmountD: (state, action: PayloadAction<string>) => {
            state.amountD = action.payload;
        },
        setAdditionalInfo2D: (state, action: PayloadAction<string>) => {
            state.additionalInfo2D = action.payload;
        },
        resetPaymentStateD: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearDerashPaymentState, () => initialState)
            .addCase(fetchDerashPayment.pending, (state) => {
                state.status = "loading";
                state.loading = true;
                state.error = null;
                state.shortMessage = null;
                state.referenceNumber = null;
                state.amount = null;
            })
            .addCase(fetchDerashPayment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.loading = false;
                state.shortMessage = action.payload?.shortMessage || null;
                state.longMessage = action.payload?.longMessage || null;
                state.referenceNumber = action.payload?.referenceNumber || null;
                state.amount = action.payload?.amountD || null;
            })
            .addCase(fetchDerashPayment.rejected, (state, action) => {
                state.status = "failed";
                state.longMessage = action.payload as string;
                state.shortMessage = action.payload as string;
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export const {
    setCardNumberD,
    setPinDpD,
    setVendorAccountD,
    setAmountD,
    setAdditionalInfo2D,
    resetPaymentStateD,
} = derashPaymentSlice.actions;

export default derashPaymentSlice.reducer;
