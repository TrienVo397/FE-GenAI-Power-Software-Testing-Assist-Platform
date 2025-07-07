// filepath: src/services/projectService.ts
import { PROJECT_SERVICE_URL } from '../configs/UrlConfig';
import { get, post, put, del } from '../configs/RequestConfig';
import _ from 'lodash';

/**
 * Generic Project type
 */
export interface Project {
  [key: string]: any;
  id?: string | number;
  current_version?: string;
  current_version_label?: string;
  version_info?: { version_label?: string; [key: string]: any };
}

/**
 * Data used to create or update a project
 */
export interface ProjectData {
  [key: string]: any;
}

/**
 * Fetches a paginated list of projects for the current user.
 * @param skip - Number of items to skip (pagination offset)
 * @param limit - Maximum number of items to return
 * @returns Array of Project objects
 */
export const getProjects = async (
  skip: number = 0,
  limit: number = 100
): Promise<Project[]> => {
  const url = `${PROJECT_SERVICE_URL}?skip=${skip}&limit=${limit}`;
  try {
    const response = await get(url);
    const data: Project[] = response.data;

    return data.map((project) => {
      // Ensure current_version_label exists
      if (project.current_version && !project.current_version_label) {
        project.current_version_label = _.get(
          project,
          'current_version_label',
          _.get(project, 'version_info.version_label', 'v0')
        );
      }
      return project;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Creates a new project.
 * @param projectData - Payload for new project
 * @returns The created Project object
 */
export const createProject = async (
  projectData: ProjectData
): Promise<Project> => {
  try {
    const response = await post(PROJECT_SERVICE_URL, projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Updates an existing project.
 * @param projectId - ID of the project to update
 * @param projectData - Updated payload
 * @returns The updated Project object
 */
export const updateProject = async (
  projectId: string | number,
  projectData: ProjectData
): Promise<Project> => {
  const url = `${PROJECT_SERVICE_URL}/${projectId}`;
  try {
    const response = await put(url, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Deletes a project.
 * @param projectId - ID of the project to delete
 * @returns The deleted Project object or deletion result
 */
export const deleteProject = async (
  projectId: string | number
): Promise<Project> => {
  const url = `${PROJECT_SERVICE_URL}/${projectId}`;
  try {
    const response = await del(url);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Retrieves detailed information for a single project version.
 * @param projectId - ID of the project
 * @returns Project object with version details
 */
export const getProjectVersion = async (
  projectId: string | number
): Promise<Project> => {
  const url = `${PROJECT_SERVICE_URL}/${projectId}`;
  try {
    const response = await get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching project version:', error);
    throw error;
  }
};
