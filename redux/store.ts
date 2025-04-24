import { configureStore } from "@reduxjs/toolkit";
import vendorReducer from "./slices/service/vendorSlice";
import dstvReducer from "./slices/service/dstvSlice";
import webSprixReducer from "./slices/service/webSprixSlice";
import guzoGoReducer from "./slices/service/guzoGoSlice";
import paymentReducer from "./paymentSlice";
import dstvPaymentReducer from "./dstvPaymentSlice";
import dstvCatalogReducer from "./slices/service/dstvCatalog";
import billLookupReducer from "./billLookupSlice";
import otpReducer from "./slices/payment/otpSlice";
import dstvCatalogPaymentReducer from "./dstvCatalogPaymentSlice";
import dstvCalculationReducer from './dstvCalculationSlice';
import aggrigatorReducer from './aggrigatorSlice'
import derashReducer from './slices/service/derashSlice'
import amolePaymentReducer from './amolePaymentSlice'

const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    dstv: dstvReducer,
    otp: otpReducer,
    webSprix: webSprixReducer,
    payment: paymentReducer,
    dstvPayment: dstvPaymentReducer,
    dstvCatalog: dstvCatalogReducer,
    guzoGo: guzoGoReducer,
    billLookup: billLookupReducer,
    dstvCatalogPayment: dstvCatalogPaymentReducer,
    dstvCalculation: dstvCalculationReducer,
    aggrigator: aggrigatorReducer,
    derash: derashReducer,
    amolePayment: amolePaymentReducer








  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

