import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { loginAPI, registerAPI, getMeAPI } from "../services/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const data = await loginAPI(email, password);

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Login failed. Please try again.";

          set({
            isLoading: false,
            error: message,
          });

          return { success: false, message };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const data = await registerAPI(name, email, password);

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: data.message || "Account created successfully",
          };
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Registration failed. Please try again.";

          set({
            isLoading: false,
            error: message,
          });

          return { success: false, message };
        }
      },

      checkAuth: async () => {
        const token = get().token;

        if (!token) {
          set({ user: null, token: null });
          return false;
        }

        set({ isLoading: true });

        try {
          const data = await getMeAPI();

          set({
            user: data.user,
            isLoading: false,
          });

          return true;
        } catch {
          set({
            user: null,
            token: null,
            isLoading: false,
          });

          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "collabboard-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
