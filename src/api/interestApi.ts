import { apiRequest } from "../utils/apiRequest";
import { Interest } from "../types/interest";

interface InterestsResponse {
  status: string;
  data: {
    interests: Interest[];
  };
}

export const interestApi = {
  getAll: async () => {
    return apiRequest<InterestsResponse>("/interests", {
      method: "GET",
    });
  },
};
