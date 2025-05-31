import { useState, useEffect } from "react";
import { interestApi } from "../api/interestApi";
import { Interest } from "../types/interest";

export const useInterest = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await interestApi.getAll();
        setInterests(res.data?.data.interests || []);
      } catch (e) {
        setError("Failed to load interests");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { interests, loading, error };
};
