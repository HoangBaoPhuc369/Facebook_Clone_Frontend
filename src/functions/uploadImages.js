import axios from "axios";

export const uploadImages = async (formData, token) => {
    try {
      console.log()
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/uploads/upload-images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "multipart/form-data",
            },
          }
        );
        return data;
      } catch (error) {
        return error.response.data.message;
      }
};