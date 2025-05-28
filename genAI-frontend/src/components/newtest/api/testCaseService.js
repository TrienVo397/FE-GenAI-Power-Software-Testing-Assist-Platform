import axios from "axios";

export const generateTestCases = async (file) => {
  const payload = new FormData();
  payload.append("file", file);

  const response = await axios.post("http://localhost:5000/generate-test-cases", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
