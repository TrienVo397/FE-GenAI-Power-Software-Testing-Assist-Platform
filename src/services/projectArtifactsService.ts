// filepath: src/services/projectArtifactsService.ts
import { API_SERVICE_URL } from '../configs/UrlConfig';
import { get, put } from '../configs/RequestConfig';
import _ from 'lodash';

// Type for ID, can be string or number
type ID = string | number;

/**
 * Fetch all project artifacts (checklists and test cases) for a specific project.
 * @param projectId - The ID of the project
 */
export const getProjectArtifacts = async (
  projectId: ID
): Promise<any> => {
  try {
    const response = await get(
      `${API_SERVICE_URL}/project-artifacts/project/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching project artifacts:', error);
    throw error;
  }
};

/**
 * Fetch a single project artifact by its ID.
 * @param artifactId - The ID of the artifact
 */
export const getProjectArtifactById = async (
  artifactId: ID
): Promise<any> => {
  try {
    const response = await get(
      `${API_SERVICE_URL}/project-artifacts/${artifactId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching project artifact:', error);
    throw error;
  }
};

/**
 * Fetch the raw content of an artifact file.
 * @param projectId - The ID of the project
 * @param filePath - The file path of the artifact
 */
export const getArtifactFileContent = async (
  projectId: ID,
  filePath: string
): Promise<any> => {
  const encoded = encodeURIComponent(filePath);
  try {
    const response = await get(
      `${API_SERVICE_URL}/projects/${projectId}/files/${encoded}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching artifact file content:', error);
    throw error;
  }
};

/**
 * Fetch the content of an artifact file as JSON (for editing).
 * @param projectId - The ID of the project
 * @param filePath - The file path of the artifact
 */
export const getArtifactFileContentAsJson = async (
  projectId: ID,
  filePath: string
): Promise<any> => {
  const encoded = encodeURIComponent(filePath);
  try {
    const response = await get(
      `${API_SERVICE_URL}/projects/${projectId}/files/${encoded}?as_json=true`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching artifact file content as JSON:', error);
    throw error;
  }
};

/**
 * Update the content of an artifact file with an optional description.
 * @param projectId - The ID of the project
 * @param filePath - The file path of the artifact
 * @param content - The new content string
 * @param description - Description of the update
 */
export const updateArtifactFileContent = async (
  projectId: ID,
  filePath: string,
  content: string,
  description: string = ''
): Promise<any> => {
  const encoded = encodeURIComponent(filePath);
  try {
    const response = await put(
      `${API_SERVICE_URL}/projects/${projectId}/files/${encoded}`,
      { content, description }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating artifact file content:', error);
    throw error;
  }
};
