import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import qs from 'qs';

interface BillPaymentState {
    firstName: string;
    shortMessage: string;
    referenceNumber: string;
    longMessage: string;
    cardNumber: string;
    pin: string;
    vendorAccount: string;
    additionalInfo1: string;
    amountX: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BillPaymentState = {
    firstName: '',
    shortMessage: '',
    referenceNumber: '',
    longMessage: '',
    cardNumber: '',
    pin: '',
    vendorAccount: '',
    additionalInfo1: '',
    amountX: '',
    status: 'idle',
    error: null,
};

interface PaymentPayload {
    cardNumber: string;
    pin: string;
    vendorAccount: string;
    additionalInfo1: string;
    amountX: string;
}

interface ApiResponseItem {
    BODY_CardNumber?: string;
    MSG_ShortMessage?: string;
    HDR_ReferenceNumber?: string;
    MSG_LongMessage?: string;
}

export const makePayment = createAsyncThunk<
    ApiResponseItem,
    PaymentPayload,
    { rejectValue: string }
>('billPayment/makePayment', async ({ cardNumber, pin, vendorAccount, additionalInfo1, amountX }, { rejectWithValue }) => {
    const url = 'http://uatc.api.myamole.com:8075/amole/pay';

    const data = qs.stringify({
        BODY_CardNumber: cardNumber,
        BODY_ExpirationDate: '',
        BODY_PIN: pin,
        BODY_PaymentAction: '31',
        BODY_AmountX: amountX,
        BODY_AmoleMerchantID: 'WHATSAPPBOT',
        BODY_OrderDescription: 'payment',
        BODY_SourceTransID: 'test123456789',
        BODY_VendorAccount: vendorAccount,
        BODY_AdditionalInfo1: additionalInfo1,
        BODY_AdditionalInfo2: '',
        BODY_AdditionalInfo3: '',
        BODY_AdditionalInfo4: '',
        BODY_AdditionalInfo5: '',
    });

    try {
        const response = await axios.post(url, data, {
            headers: {
                HDR_Signature: 'Uiga2zFA3l6zN0yNTIB75UAVWH4aVXNT7Jjgadri37OWiwuryg-8A7kUloURXj-5fXjgkt',
                HDR_IPAddress: '0.0.0.0',
                HDR_UserName: 'whatsappbot',
                HDR_Password: 'test',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const responseData = response.data;
        if (responseData && responseData.length > 0) {
            return responseData[0] as ApiResponseItem;
        } else {
            return rejectWithValue('No data found');
        }
    } catch (error: any) {
        return rejectWithValue(error.response?.data ?? error.message ?? 'An unknown error occurred');
    }
});

const billPaymentSlice = createSlice({
    name: 'billPayment',
    initialState,
    reducers: {
        setCardNumber: (state, action: PayloadAction<string>) => {
            state.cardNumber = action.payload;
        },
        setPin: (state, action: PayloadAction<string>) => {
            state.pin = action.payload;
        },
        setVendorAccount: (state, action: PayloadAction<string>) => {
            state.vendorAccount = action.payload;
        },
        setAdditionalInfo1: (state, action: PayloadAction<string>) => {
            state.additionalInfo1 = action.payload;
        },
        setAmountX: (state, action: PayloadAction<string>) => {
            state.amountX = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(makePayment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(makePayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const payload = action.payload;
                state.firstName = payload.BODY_CardNumber || 'N/A';
                state.shortMessage = payload.MSG_ShortMessage || 'N/A';
                state.referenceNumber = payload.HDR_ReferenceNumber || 'N/A';
                state.longMessage = payload.MSG_LongMessage || 'N/A';
            })
            .addCase(makePayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ?? 'An error occurred';
            });
    },
});

export const {
    setCardNumber,
    setPin,
    setVendorAccount,
    setAdditionalInfo1,
    setAmountX,
} = billPaymentSlice.actions;

export default billPaymentSlice.reducer;
