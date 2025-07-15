import { TEST_CASE_SERVICE_URL } from "@@/configs/UrlConfig";
import { sendHttpRequest } from "@@/configs/RequestConfig";

export const generateTestCases = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const result = await sendHttpRequest(
    `${TEST_CASE_SERVICE_URL}/generate-test-cases`,
    "POST",
    formData
  );

  return result.json;
};
