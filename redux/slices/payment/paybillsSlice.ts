// import qs from "qs";
// import configuration from "../../../config/configurations";
// import AmolePayment from "../../../services/AmolePayment";

// interface BillLookupInfo {
//     vendorAccount: string;
//     info1: string;
//     info2: string;
// }

// export const billLookupViaPaymentApi = async (lookupInfo: BillLookupInfo): Promise<any> => {
//     const payload = qs.stringify({
//         BODY_CardNumber: ``,
//         BODY_ExpirationDate: "",
//         BODY_PIN: ``,
//         BODY_PaymentAction: "30",
//         BODY_AmountX: ``,
//         BODY_AmoleMerchantID: configuration.merchantId,
//         BODY_OrderDescription: "bill lookup",
//         BODY_SourceTransID: "",
//         BODY_VendorAccount: `${lookupInfo.vendorAccount}`,
//         BODY_AdditionalInfo1: `${lookupInfo.info1}`,
//         BODY_AdditionalInfo2: `${lookupInfo.info2}`,
//         BODY_AdditionalInfo3: ``,
//         BODY_AdditionalInfo4: "",
//         BODY_AdditionalInfo5: "",
//     });
//     return await AmolePayment(payload);
// };

// interface BillPaymentData {
//     AcctNum: string;
//     pin: string;
//     amount: string;
//     description: string;
//     vendorAccount: string;
//     info1: string;
//     info5: string;
// }

// export const billPayment = async (billPaymentData: BillPaymentData): Promise<any> => {
//     console.log(billPaymentData, "bill payment data ");
//     const payload = qs.stringify({
//         BODY_CardNumber: `${billPaymentData.AcctNum}`,
//         BODY_ExpirationDate: "",
//         BODY_PIN: `${billPaymentData.pin}`,
//         BODY_PaymentAction: "31",
//         BODY_AmountX: `${billPaymentData.amount}`,
//         BODY_AmoleMerchantID: configuration.merchantId,
//         BODY_OrderDescription: `${billPaymentData.description}`,
//         BODY_SourceTransID: "",
//         BODY_VendorAccount: `${billPaymentData.vendorAccount}`,
//         BODY_AdditionalInfo1: `${billPaymentData.info1}`,
//         BODY_AdditionalInfo2: `${""}`,
//         BODY_AdditionalInfo3: ``,
//         BODY_AdditionalInfo4: "",
//         BODY_AdditionalInfo5: `${billPaymentData.info5}`,
//     });
//     return await AmolePayment(payload);
// };

// export const dstvBillCalculate = async (dstvBillCalcInfo) => {
//     console.log(dstvBillCalcInfo, "dstv bill calculate  info");
//     const payload = qs.stringify({
//         BODY_CardNumber: ``,
//         BODY_ExpirationDate: "",
//         BODY_PIN: ``,
//         BODY_PaymentAction: "30",
//         BODY_AmountX: ``,
//         BODY_AmoleMerchantID: configuration.merchantId,
//         BODY_OrderDescription: "DStv payment",
//         BODY_SourceTransID: "",
//         BODY_VendorAccount: ``,
//         BODY_AdditionalInfo1: `DSTV`,
//         BODY_AdditionalInfo2: `${dstvBillCalcInfo.packageCode}`,
//         BODY_AdditionalInfo3: `${dstvBillCalcInfo.month}`,
//         BODY_AdditionalInfo4: "",
//         BODY_AdditionalInfo5: "",
//     });
//     return await AmolePayment(payload);
// };

// export const dstvBillPayment = async (dstvBillData) => {
//     console.log(dstvBillData, "dstv payment Info");
//     const payload = qs.stringify({
//         BODY_CardNumber: `${dstvBillData.sourceAcc}`,
//         BODY_ExpirationDate: "",
//         BODY_PIN: `${dstvBillData.pin}`,
//         BODY_PaymentAction: "31",
//         BODY_AmountX: `${dstvBillData.amount}`,
//         BODY_AmoleMerchantID: configuration.merchantId,
//         BODY_OrderDescription: "DStv payment",
//         BODY_SourceTransID: "",
//         BODY_VendorAccount: `${dstvBillData.smartCardNo}`,
//         BODY_AdditionalInfo1: `DSTV`,
//         BODY_AdditionalInfo2: `${dstvBillData.packageCode}`,
//         BODY_AdditionalInfo3: `${dstvBillData.month}`,
//         BODY_AdditionalInfo4: "",
//         BODY_AdditionalInfo5: "",
//     });
//     console.log(payload);

//     return await AmolePayment(payload);
// };
