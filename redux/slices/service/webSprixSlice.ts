// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import qs from "qs";

// interface WebSprixState {
//     amountDue: string | null;
//     line1: string | null;
//     line2: string | null;
//     line3: string | null;
//     line4: string | null;
//     line5: string | null;
//     line6: string | null;
//     status: "idle" | "loading" | "succeeded" | "failed";
//     error: string | null;
// }

// const initialState: WebSprixState = {
//     amountDue: null,
//     line1: null,
//     line2: null,
//     line3: null,
//     line4: null,
//     line5: null,
//     line6: null,
//     status: "idle",
//     error: null,
// };

// interface WebSprixResponse {
//     AmountDue: string;
//     Line1: string;
//     Line2: string;
//     Line3: string;
//     Line4: string;
//     Line5: string;
//     Line6: string;
// }

// export const fetchWebSprix = createAsyncThunk<WebSprixResponse, string>(
//     "websprix/fetchWebSprix",
//     async (smartCardNumber) => {
//         const url = "http://uatc.api.myamole.com:8075/amole/service";
//         const data = qs.stringify({
//             BODY_ServiceRequest: `<Service>WebSprixBillLookup</Service><SmartCardNumber>${smartCardNumber}</SmartCardNumber>`,
//         });

//         const response = await axios.post(url, data, {
//             headers: {
//                 HDR_Signature:
//                     "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
//                 HDR_IPAddress: "0.0.0.0",
//                 HDR_UserName: "mpos",
//                 HDR_Password: "test",
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//         });

//         const custData: WebSprixResponse = JSON.parse(
//             response.data[0].BODY_ServiceResponse
//         );
//         return custData;
//     }
// );

// const webSprixSlice = createSlice({
//     name: "websprix",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchWebSprix.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(
//                 fetchWebSprix.fulfilled,
//                 (state, action: PayloadAction<WebSprixResponse>) => {
//                     state.status = "succeeded";
//                     state.amountDue = action.payload.AmountDue;
//                     state.line1 = action.payload.Line1;
//                     state.line2 = action.payload.Line2;
//                     state.line3 = action.payload.Line3;
//                     state.line4 = action.payload.Line4;
//                     state.line5 = action.payload.Line5;
//                     state.line6 = action.payload.Line6;
//                 }
//             )
//             .addCase(fetchWebSprix.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.error.message || "Something went wrong";
//             });
//     },
// });

// export default webSprixSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import qs from "qs";
import axios from "axios";

interface WebsprixState {
    firstName?: string;
    gender?: string;
    phoneNumber?: string;
    amount?: string;
    fee?: string;
    totalAmount?: string;
    error?: string | null;
    loading: boolean;
}

const initialState: WebsprixState = {
    firstName: "",
    gender: "",
    phoneNumber: "",
    amount: "",
    fee: "",
    totalAmount: "",
    error: null,
    loading: false,
};

export const fetchWebsprixData = createAsyncThunk(
    "websprix/fetchWebsprixData",
    async (keyValue: string, { rejectWithValue }) => {
        const url = "http://uatc.api.myamole.com:8075/amole/service";
        const data = qs.stringify({
            BODY_ServiceRequest: `<Service>WebSprixBillLookup</Service><KeyValue>${keyValue}</KeyValue>`,
        });

        try {
            const res = await axios.post(url, data, {
                headers: {
                    HDR_Signature: "6l3kD77Gg7077n1cgBowPX-Xyz4Fbpu54Kp0_4rpwdBjJ9kD7YDaYIPzYgf",
                    HDR_IPAddress: "0.0.0.0",
                    HDR_UserName: "mpos",
                    HDR_Password: "test",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const response = res.data[0].BODY_ServiceResponse;

            if (response) {
                const obj = JSON.parse(response);
                return {
                    firstName: obj.Line3,
                    gender: obj.Line1,
                    phoneNumber: obj.Line2,
                    amount: obj.AmountDue,
                    fee: obj.Line5,
                    totalAmount: obj.Line6,
                };
            } else {
                return rejectWithValue("Empty response");
            }
        } catch (error) {
            return rejectWithValue("API request failed");
        }
    }
);

const websprixSlice = createSlice({
    name: "websprix",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWebsprixData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWebsprixData.fulfilled, (state, action) => {
                state.loading = false;
                state.firstName = action.payload.firstName;
                state.gender = action.payload.gender;
                state.phoneNumber = action.payload.phoneNumber;
                state.amount = action.payload.amount;
                state.fee = action.payload.fee;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(fetchWebsprixData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default websprixSlice.reducer;
