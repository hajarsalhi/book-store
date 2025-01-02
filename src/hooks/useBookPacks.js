import { useEffect, useState } from 'react';
import { bookPacksAPI } from '../services/api';

const useBookPacks = (category) => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookPacks = async () => {
      try {
        const response = await bookPacksAPI.getBookPacks(category);
        setPacks(response.data);
      } catch (err) {
        setError('Error fetching book packs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookPacks();
  }, []);

  return { packs, loading, error };
};

export default useBookPacks; 