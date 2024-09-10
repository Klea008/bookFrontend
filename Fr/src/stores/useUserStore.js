import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast"

const useUserStore = create((set, get) => ({
     user: null,
     loading: false,
     checkingAuth: true,

     setUser: (user) => set({ user }),
     signup: async ({ fullName, email, password }) => {
          try {
               const response = await axiosInstance.post("/create-user", {
                    fullName, email, password
               });
               if (response.data) {
                    set({ user: response.data.user, loading: false });
                    toast.success(response.data.message);
               } else {
                    toast.error(response.data.message);
               }
          } catch (error) {
               set({ loading: false })
          }
     },
     login: async ({ email, password }) => {
          try {
               const response = await axiosInstance.post("/login", {
                    email,
                    password
               });
               if (response.data) {
                    set({ user: response.data.user });
                    toast.success(response.data.message);
               } else {
                    toast.error(response.data.message);
                    console.log("this shouldn happen")
               }
          } catch (error) {
               console.log(error);
          }
     },
     logout: async () => {
          try {
               const response = await axiosInstance.post("/logout");
               if (response.data) {
                    set({ user: null });
                    toast.success(response.data.message);
               } else {
                    toast.error(response.data.message);
               }
          } catch (error) {
               console.log(error);
          }
     },
     checkAuth: async () => {
          set({ checkingAuth: true });
          try {
               const response = await axiosInstance.get("/profile");
               set({ user: response.data.user, checkingAuth: false });
          } catch (error) {
               set({ user: null, checkingAuth: false });
          }
     }
}));


export default useUserStore