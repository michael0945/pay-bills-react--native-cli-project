import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import AmolePayment from '../services/AmolePayment';
import configuration from '../config/configurations';

interface DstvCalculationState {
    BODY_AdditionalInfo2: string;
    BODY_AdditionalInfo3: string;
    shortMessage: string | null;
    longMessage: string | null;
    amount: string | null;
    referenceNumber: string | null;
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DstvCalculationState = {
    BODY_AdditionalInfo2: '',
    BODY_AdditionalInfo3: '',
    shortMessage: null,
    longMessage: null,
    amount: null,
    referenceNumber: null,
    loading: false,
    error: null,
    status: 'idle',
};

export const fetchDstvCalculation = createAsyncThunk(
    'dstvCalculation/fetch',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const { BODY_AdditionalInfo2, BODY_AdditionalInfo3 } = state.dstvCalculation;

            const requestBody = {
                BODY_CardNumber: '',
                BODY_ExpirationDate: '',
                BODY_PIN: '',
                BODY_PaymentAction: '30',
                BODY_AmountX: '',
                BODY_AmoleMerchantID: configuration.merchantId,
                BODY_OrderDescription: 'DSTV payment',
                BODY_SourceTransID: 'test123456789',
                BODY_VendorAccount: '',
                BODY_AdditionalInfo1: 'DSTV',
                BODY_AdditionalInfo2,
                BODY_AdditionalInfo3,
                BODY_AdditionalInfo4: '',
                BODY_AdditionalInfo5: 'Michaelm',
            };

            const response = await AmolePayment(requestBody);
            console.log("API Response:", response);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const dstvCalculationSlice = createSlice({
    name: 'dstvCalculation',
    initialState,
    reducers: {
        setInfo2: (state, action: PayloadAction<string>) => {
            state.BODY_AdditionalInfo2 = action.payload;
        },
        setInfo3: (state, action: PayloadAction<string>) => {
            state.BODY_AdditionalInfo3 = action.payload;
        },
        resetCalculationState: (state) => {
            state.BODY_AdditionalInfo2 = '';
            state.BODY_AdditionalInfo3 = '';
            state.shortMessage = null;
            state.longMessage = null;
            state.amount = null;
            state.referenceNumber = null;
            state.loading = false;
            state.error = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDstvCalculation.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDstvCalculation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.shortMessage = action.payload.MSG_ShortMessage;
                state.longMessage = action.payload.MSG_LongMessage;
                state.amount = action.payload.BODY_Amount;
                state.referenceNumber = action.payload.HDR_ReferenceNumber;
            })
            .addCase(fetchDstvCalculation.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setInfo2, setInfo3, resetCalculationState } = dstvCalculationSlice.actions;
export default dstvCalculationSlice.reducer;
