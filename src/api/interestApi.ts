import { apiRequest } from "../utils/apiRequest";
import { Interest } from "../types/interest";

interface InterestsResponse {
  status: string;
  data: {
    interests: Interest[];
  };
}

interface UpdateInterestsResponse {
  status: string;
  data: {
    user: any;
  };
}

export const interestApi = {
  getAll: async () => {
    return apiRequest<InterestsResponse>("/interests", {
      method: "GET",
    });
  },

  updateInterests: async (interests: string[]) => {
    return apiRequest<UpdateInterestsResponse>("/users/update-interests", {
      method: "POST",
      data: { interests },
    });
  },
};
