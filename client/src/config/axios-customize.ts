import axiosClient from "axios";

const instance = axiosClient.create({
	baseURL: import.meta.env.VITE_API_BASE_URL! as string,
});

export default instance;
