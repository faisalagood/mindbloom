export const useLocalStorage = (key) => {
  const getStoredData = () => {
    if (typeof window === 'undefined') return null;
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  };

  const setStoredData = (data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  };

  return { getStoredData, setStoredData };
};