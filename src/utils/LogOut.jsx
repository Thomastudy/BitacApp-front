import axios from "../config/axios";

export const LogOut = async (navigate, logOutContext) => {
  try {
    logOutContext();
    if (response.status === 200) {
      navigate("/");
    }
  } catch (error) {
    console.log("Error durante el logout:", error);
  }
};
