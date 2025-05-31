import { useEffect, useState } from "react";
import { categoryApi } from "../api/categoryApi";
import { Category } from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data.data?.data.categories || []); // An toàn hơn, tránh lỗi nếu không có categories
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { categories, loading, error };
};
