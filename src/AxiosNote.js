import axios from 'axios';

const AxiosNote = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default AxiosNote;
