import axios from "axios";
import { APIResponse, GenericErrors } from ".";

export type AddEmailToListErrors = GenericErrors;
export type AddEmailToListResponse = APIResponse<{id: number, userId: number, consent: boolean}, AddEmailToListErrors>;

export type MarketingResponse = APIResponse<
  AddEmailToListResponse | null,
  AddEmailToListErrors
>;

export const createMarketingAPI = (apiURL: string) => {
  return {
    addEmailToList: async (userId: number, consent: boolean): Promise<AddEmailToListResponse> => {
      try {
        const successResponse = await axios.post(`${apiURL}/marketing/new`, {
          userId,
          consent
        });
        return successResponse.data as AddEmailToListResponse;
      } catch (err) {
        //@ts-ignore
        return err.response.data as APIResponse;
      }
    },
  };
};
