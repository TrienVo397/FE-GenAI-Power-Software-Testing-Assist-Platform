// filepath: src/services/fileExplorerService.js
import { BASE_URL } from '../configs/UrlConfig';
import { get, post, del } from '../configs/RequestConfig';
import axios from 'axios';
import _ from 'lodash';

// Import AUTH_CONFIG for proper token key
import { AUTH_CONFIG } from '../configs/EnvConfig';

// Create an axios instance for binary file downloads
const axiosInstance = axios.create({
  headers: {
    "Accept": "*/*",
  },
  withCredentials: false,
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const FILE_API_URL = `${BASE_URL}/projects`;

/**
 * List files in a project or directory
 * @param {string} projectId - The ID of the project
 * @param {string} directory - Optional subdirectory path
 * @param {boolean} recursive - Whether to include subdirectories recursively
 * @param {boolean} includeHidden - Whether to include hidden files/directories
 * @returns {Promise} Promise with the files data
 */
export const listFiles = async (projectId, directory = null, recursive = true, includeHidden = false) => {
  try {
    let url = `${FILE_API_URL}/${projectId}/files`;
    const params = new URLSearchParams();
    
    if (directory) params.append('directory', directory);
    params.append('recursive', recursive);
    params.append('include_hidden', includeHidden);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    const response = await get(url);
    return response.data;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Get file metadata without downloading content
 * @param {string} projectId - The ID of the project
 * @param {string} filePath - Path to the file or directory
 * @returns {Promise} Promise with the file metadata
 */
export const getFileInfo = async (projectId, filePath) => {
  try {
    const response = await get(`${FILE_API_URL}/${projectId}/files/${filePath}/info`);
    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

/**
 * Get file content
 * @param {string} projectId - The ID of the project
 * @param {string} filePath - Path to the file
 * @param {boolean} asBinary - Whether to request as binary data
 * @returns {Promise} Promise with the file content
 */
export const getFileContent = async (projectId, filePath, asBinary = false) => {
  try {
    // For file downloads, we want to get the raw binary data
    const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}`;
    
    if (asBinary) {
      // For binary downloads, use our axiosInstance with responseType: 'arraybuffer'
      const response = await axiosInstance.get(url, { 
        responseType: 'arraybuffer',
        headers: {
          'Accept': '*/*'  // Accept any content type
        }
      });
      return response.data;
    } else {
      // For regular content viewing (like text files), use the standard get
      const response = await get(url);
      return response.data;
    }
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
};

/**
 * Upload a file to the project
 * @param {string} projectId - The ID of the project
 * @param {string} filePath - Path where to save the file
 * @param {File} file - File to upload
 * @returns {Promise} Promise with the upload result
 */
export const uploadFile = async (projectId, filePath, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await post(`${FILE_API_URL}/${projectId}/files/${filePath}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file or directory from the project
 * @param {string} projectId - The ID of the project
 * @param {string} filePath - Path to the file or directory to delete
 * @returns {Promise} Promise with the deletion result
 */
export const deleteFile = async (projectId, filePath) => {
  try {
    const response = await del(`${FILE_API_URL}/${projectId}/files/${filePath}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Create a new directory in the project
 * @param {string} projectId - The ID of the project
 * @param {string} directoryPath - Path for the new directory
 * @returns {Promise} Promise with the creation result
 */
export const createDirectory = async (projectId, directoryPath) => {
  try {
    const response = await post(`${FILE_API_URL}/${projectId}/directories/${directoryPath}`);
    return response.data;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};
