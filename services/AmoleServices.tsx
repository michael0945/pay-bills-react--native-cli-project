import axios, { AxiosResponse } from "axios";
import configuration from "../config/configurations";

interface ServiceRequest {
    [key: string]: any;
}

const AmoleServices = async (obj: ServiceRequest): Promise<AxiosResponse> => {
    const response = await axios.post(configuration.serviceAPI, obj, {
        headers: {
            HDR_Signature: configuration.Signiture,
            HDR_IPAddress: configuration.IpAddress,
            HDR_UserName: configuration.UserName,
            HDR_Password: configuration.Password,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return response;
};


export default AmoleServices;

