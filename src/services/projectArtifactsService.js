// filepath: src/services/projectArtifactsService.js
import { API_SERVICE_URL } from '../configs/UrlConfig';
import { get } from '../configs/RequestConfig';
import _ from 'lodash';

/**
 * Fetches all project artifacts (checklists and test cases) for a specific project
 * @param {string|number} projectId - The ID of the project to fetch artifacts for
 * @returns {Promise} Promise with the project artifacts data
 */
export const getProjectArtifacts = async (projectId) => {
  try {
    const response = await get(`${API_SERVICE_URL}/project-artifacts/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project artifacts:', error);
    throw error;
  }
};

/**
 * Fetches a single project artifact by ID
 * @param {string|number} artifactId - The ID of the artifact to fetch
 * @returns {Promise} Promise with the artifact data
 */
export const getProjectArtifactById = async (artifactId) => {
  try {
    const response = await get(`${API_SERVICE_URL}/project-artifacts/${artifactId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project artifact:', error);
    throw error;
  }
};

/**
 * Fetches the content of a project artifact file
 * @param {string|number} projectId - The ID of the project
 * @param {string} filePath - The file path of the artifact
 * @returns {Promise} Promise with the artifact file content
 */
export const getArtifactFileContent = async (projectId, filePath) => {
  try {
    // Ensure filePath is properly encoded for URL use
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await get(`${API_SERVICE_URL}/projects/${projectId}/files/${encodedFilePath}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artifact file content:', error);
    throw error;
  }
};

/**
 * Fetches the content of a project artifact file as JSON (for editing)
 * @param {string|number} projectId - The ID of the project
 * @param {string} filePath - The file path of the artifact
 * @returns {Promise} Promise with the artifact file content as JSON
 */
export const getArtifactFileContentAsJson = async (projectId, filePath) => {
  try {
    // Ensure filePath is properly encoded for URL use
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await get(`${API_SERVICE_URL}/projects/${projectId}/files/${encodedFilePath}?as_json=true`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artifact file content as JSON:', error);
    throw error;
  }
};

/**
 * Updates the content of a project artifact file
 * @param {string|number} projectId - The ID of the project
 * @param {string} filePath - The file path of the artifact
 * @param {string} content - The new content
 * @param {string} description - Optional description of changes
 * @returns {Promise} Promise with the update result
 */
export const updateArtifactFileContent = async (projectId, filePath, content, description = '') => {
  try {
    const { put } = await import('../configs/RequestConfig');
    const encodedFilePath = encodeURIComponent(filePath);
    const response = await put(`${API_SERVICE_URL}/projects/${projectId}/files/${encodedFilePath}`, {
      content,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error updating artifact file content:', error);
    throw error;
  }
};
