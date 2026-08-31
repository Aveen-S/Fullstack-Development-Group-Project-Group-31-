import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("collabboard-auth");

    if (stored) {
      try {
        const { state } = JSON.parse(stored);

        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("collabboard-auth");

      const path = window.location.pathname;

      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const loginAPI = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerAPI = async (name, email, password) => {
  const response = await API.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const getMeAPI = async () => {
  const response = await API.get("/auth/me");

  return response.data;
};

export const fetchTasksAPI = async () => {
  const response = await API.get("/tasks");

  return response.data;
};

export const createTaskAPI = async (taskData) => {
  const response = await API.post("/tasks", taskData);

  return response.data;
};

export const updateTaskAPI = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData);

  return response.data;
};

export const deleteTaskAPI = async (id) => {
  const response = await API.delete(`/tasks/${id}`);

  return response.data;
};

export const getUserProfileAPI = async () => {
  const response = await API.get("/users/profile");

  return response.data;
};

export const updateUserProfileAPI = async (profileData) => {
  const response = await API.put("/users/profile", profileData);

  return response.data;
};

export const fetchBoardsAPI = async () => {
  const response = await API.get("/boards");

  return response.data;
};

export const createBoardAPI = async (boardData) => {
  const response = await API.post("/boards", boardData);

  return response.data;
};

export default API;
