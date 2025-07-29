import axios from 'axios';

// Function to get data from backend
const fetchData = async () => {
  try {
    const response = await axios.get('/api/your-endpoint');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data', error);
    return [];
  }
};

export default fetchData;
