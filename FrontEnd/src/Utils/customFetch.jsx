

const customFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("API Error:", data?.message || response.statusText);
      return { success: false, data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    return { success: false, data: null };
  }
};
export default customFetch