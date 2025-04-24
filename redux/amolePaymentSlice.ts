import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface PaymentState {
    loading: boolean;
    error: string | null;
    cardNumber: string | null;
    shortMessage: string | null;
    referenceNumber: string | null;
    amount: string | null;
}

const initialState: PaymentState = {
    loading: false,
    error: null,
    cardNumber: null,
    shortMessage: null,
    referenceNumber: null,
    amount: null,
};

export const fetchAmolePayment = createAsyncThunk(
    "payment/fetchAmolePayment",
    async (_, { rejectWithValue }) => {
        try {
            const url = "http://uatc.api.myamole.com:8075/amole/pay";
            const data = new URLSearchParams({
                BODY_CardNumber: cardNumberA,
                BODY_ExpirationDate: "",
                BODY_PIN: pinDpC,
                BODY_PaymentAction: "31",
                BODY_AmountX: amountDueC,
                BODY_AmoleMerchantID: configuration.merchantId,
                BODY_OrderDescription: "DStv payment",
                BODY_SourceTransID: "test123456789",
                BODY_VendorAccount: vendorAccountC,
                BODY_AdditionalInfo1: "DSTV",
                BODY_AdditionalInfo2: "",
                BODY_AdditionalInfo3: "",
                BODY_AdditionalInfo4: "",
                BODY_AdditionalInfo5: "Michaelm",
            });

            const res = await axios.post(url, data, {
                headers: {
                    HDR_Signature:
                        "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
                    HDR_IPAddress: "0.0.0.0",
                    HDR_UserName: "mpos",
                    HDR_Password: "test",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const custData = res.data;
            if (custData && custData.length > 0) {
                const item = custData[0];
                return {
                    cardNumber: item.BODY_CardNumber,
                    shortMessage: item.MSG_ShortMessage,
                    referenceNumber: item.HDR_ReferenceNumber,
                    amount: item.BODY_Amount,
                };
            } else {
                return rejectWithValue("No data returned from server.");
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "Unknown error");
        }
    }
);

const amolePaymentSlice = createSlice({
    name: "amolePayment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAmolePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAmolePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.cardNumber = action.payload.cardNumber;
                state.shortMessage = action.payload.shortMessage;
                state.referenceNumber = action.payload.referenceNumber;
                state.amount = action.payload.amount;
            })
            .addCase(fetchAmolePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default amolePaymentSlice.reducer;
