// filepath: src/services/projectService.js
import { PROJECT_SERVICE_URL } from '../configs/UrlConfig';
import { get, post, put, del } from '../configs/RequestConfig';
import _ from 'lodash';

/**
 * Fetches all projects for the current user
 * @param {number} skip - Number of items to skip for pagination
 * @param {number} limit - Maximum number of items to return
 * @returns {Promise} Promise with the projects data
 */
export const getProjects = async (skip = 0, limit = 100) => {
  try {
    const response = await get(`${PROJECT_SERVICE_URL}?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {object} projectData - The project data to create
 * @returns {Promise} Promise with the created project data
 */
export const createProject = async (projectData) => {
  try {
    const response = await post(PROJECT_SERVICE_URL, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {number} projectId - The ID of the project to update
 * @param {object} projectData - The updated project data
 * @returns {Promise} Promise with the updated project data
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await put(`${PROJECT_SERVICE_URL}/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {number} projectId - The ID of the project to delete
 * @returns {Promise} Promise with the deleted project data
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await del(`${PROJECT_SERVICE_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
