import axios, { AxiosResponse } from "axios";
import qs from "qs";
import configuration from "../config/configurations";

interface PaymentRequest {
  [key: string]: any;
}

const AmolePayment = async (obj: PaymentRequest): Promise<any> => {
  try {
    const requestBody = qs.stringify(obj);
    const res: AxiosResponse = await axios.post(configuration.paymentAPI, requestBody, {
      headers: {
        HDR_Signature: configuration.Signiture,
        HDR_IPAddress: configuration.IpAddress,
        HDR_UserName: configuration.UserName,
        HDR_Password: configuration.Password,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data[0] || res.data;
  } catch (error) {
    console.error("AmolePayment Error:", error);
    throw error;
  }
};

export default AmolePayment;

