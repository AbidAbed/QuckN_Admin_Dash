import axios from "axios";

export const axiosObj = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/dash/api/admin`,
});

// export const axiosObj = axios.create({
//     baseURL : "http://localhost:3001/api/admin"
// })
