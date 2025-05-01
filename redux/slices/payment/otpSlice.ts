import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import * as qs from "qs";

interface OtpState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    shortMessage: string;
    longMessage: string;
    mobileNumber1: string;
}

// Initial state
const initialState: OtpState = {
    status: "idle",
    error: null,
    shortMessage: "",
    longMessage: "",
    mobileNumber1: "",
};

// Async action to send OTP
export const sendOtp = createAsyncThunk(
    "otp/sendOtp",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { otp: OtpState };
        const { mobileNumber1 } = state.otp;
        const otpUrl = "http://uatc.api.myamole.com:8075/amole/service";

        const data = qs.stringify({
            BODY_ServiceRequest: `<Service>OTPSend</Service><MobileNumber>${mobileNumber1}</MobileNumber>`,
        });

        try {
            const response = await axios.post(otpUrl, data, {
                headers: {
                    HDR_Signature:
                        "Uiga2zFA3l6zN0yNTIB75UAVWH4aVXNT7Jjgadri37OWiwuryg-8A7kUloURXj-5fXjgkt",
                    HDR_IPAddress: "0.0.0.0",
                    HDR_UserName: "whatsappbot",
                    HDR_Password: "test",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            console.log("✅ API Response:", response.data);
            return response.data;

        }

        catch (error: any) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);
export const clearOtpState = createAction("otp/clear");
const otpSlice = createSlice({
    name: "otp",
    initialState,
    reducers: {
        setMobileNumber1: (state, action: PayloadAction<string>) => {
            state.mobileNumber1 = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearOtpState, () => initialState)
            .addCase(sendOtp.pending, (state) => {
                state.status = "loading";
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.shortMessage =
                    action.payload?.[0]?.MSG_ShortMessage || "No short message available";
                state.longMessage =
                    action.payload?.[0]?.MSG_LongMessage || "No long message available";
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            });
    },
});

export const { setMobileNumber1 } = otpSlice.actions;
export default otpSlice.reducer;
