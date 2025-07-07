// filepath: src/services/fileExplorerService.ts
import { BASE_URL } from '../configs/UrlConfig';
import { get, post, del, put } from '../configs/RequestConfig';
import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';
import { AUTH_CONFIG } from '../configs/EnvConfig';

/**
 * Axios instance for binary downloads (images, archives, etc.)
 */
const axiosInstance: AxiosInstance = axios.create({
  headers: { Accept: '*/*' },
  withCredentials: false,
});

// Attach auth token to every axiosInstance request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const FILE_API_URL = `${BASE_URL}/projects`;

/**
 * List files in a project or directory.
 */
export const listFiles = async (
  projectId: string,
  directory: string | null = null,
  recursive: boolean = true,
  includeHidden: boolean = false
): Promise<any[]> => {
  let url = `${FILE_API_URL}/${projectId}/files`;
  const params = new URLSearchParams();
  if (directory) params.append('directory', directory);
  params.append('recursive', String(recursive));
  params.append('include_hidden', String(includeHidden));

  const qs = params.toString();
  if (qs) url += `?${qs}`;

  try {
    const response = await get(url);
    return response.data as any[];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Get metadata for a single file or directory.
 */
export const getFileInfo = async (
  projectId: string,
  filePath: string
): Promise<any> => {
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}/info`;
  try {
    const response = await get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

/**
 * Retrieve file content, as text or binary.
 */
export const getFileContent = async (
  projectId: string,
  filePath: string,
  asBinary: boolean = false
): Promise<string | ArrayBuffer> => {
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}`;
  try {
    if (asBinary) {
      const resp = await axiosInstance.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: { Accept: '*/*' },
      });
      return resp.data;
    } else {
      const resp = await get(url);
      return resp.data as string;
    }
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
};

/**
 * Upload a File object to the project.
 */
export const uploadFile = async (
  projectId: string,
  filePath: string,
  file: File
): Promise<any> => {
  const form = new FormData();
  form.append('file', file);
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}`;
  try {
    const response = await post(url, form);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file or directory.
 */
export const deleteFile = async (
  projectId: string,
  filePath: string
): Promise<any> => {
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}`;
  try {
    const response = await del(url);
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Create a new directory under a project.
 */
export const createDirectory = async (
  projectId: string,
  directoryPath: string
): Promise<any> => {
  const url = `${FILE_API_URL}/${projectId}/directories/${encodeURIComponent(directoryPath)}`;
  try {
    const response = await post(url);
    return response.data;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

/**
 * Update text file content with optional description.
 */
export const updateFileContent = async (
  projectId: string,
  filePath: string,
  content: string,
  description: string = ''
): Promise<any> => {
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}`;
  try {
    const response = await put(url, { content, description });
    return response.data;
  } catch (error) {
    console.error('Error updating file content:', error);
    throw error;
  }
};

/**
 * Retrieve file content as parsed JSON.
 */
export const getFileContentAsJson = async (
  projectId: string,
  filePath: string
): Promise<any> => {
  const url = `${FILE_API_URL}/${projectId}/files/${encodeURIComponent(filePath)}?as_json=true`;
  try {
    const response = await get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting file content as JSON:', error);
    throw error;
  }
};

/**
 * Determine if a file extension supports text editing.
 */
export const isEditableFile = (filename: string): boolean => {
  const editable = ['md', 'yml', 'yaml', 'txt', 'json', 'csv', 'html', 'js', 'py', 'xml'];
  const ext = _.toLower(_.last(filename.split('.')) || '');
  return editable.includes(ext);
};
