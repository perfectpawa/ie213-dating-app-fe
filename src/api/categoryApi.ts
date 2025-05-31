import { Category } from "../types/category";
import { apiRequest } from "../utils/apiRequest";

interface CategoriesResponse {
  status: string;
  data: {
    categories: Category[];
  };
}

export const categoryApi = {
  getAll: async () => {
    return apiRequest<CategoriesResponse>("/categories", {
      method: "GET",
    });
  },
};
