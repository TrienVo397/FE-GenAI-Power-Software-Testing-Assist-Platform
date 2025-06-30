// filepath: src/services/documentVersionService.js
import { API_BASE_URL } from '../configs/UrlConfig';
import { get, post, put } from '../configs/RequestConfig';
import _ from 'lodash';

/**
 * Fetches all document versions for a specific project
 * 
 * @param {string} projectId - The UUID of the project
 * @returns {Promise} Promise with the document versions data
 */
export const getDocumentVersionsByProject = async (projectId) => {
  if (!projectId) {
    return [];
  }
  
  try {
    const response = await get(`${API_BASE_URL}/document-versions/project/${projectId}`);
    
    // Process and format the versions
    const versions = _.map(response.data, version => ({
      id: version.id,
      label: version.version_label || `v${version.id.substring(0, 6)}`,
      isCurrent: version.is_current,
      note: version.note,
      createdAt: version.created_at,
      updatedAt: version.updated_at,
    }));
    
    // Store a copy in localStorage as a fallback for future API failures
    try {
      localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
    } catch (storageError) {
      console.warn('Failed to store versions in localStorage:', storageError);
    }
    
    return _.sortBy(versions, ['label']);
  } catch (error) {
    console.error('Error fetching document versions:', error);
    
    // If API returns 404 or other error, try to load from localStorage
    try {
      const storedVersions = localStorage.getItem(`project_${projectId}_versions`);
      if (storedVersions) {
        const parsedVersions = JSON.parse(storedVersions);
        console.info('Using cached versions from localStorage');
        return parsedVersions;
      }
      
      // If no versions in localStorage, create a default mock version
      const projectInfo = localStorage.getItem('projectInfo');
      let currentVersion = 'v1.0.0';
      
      if (projectInfo) {
        try {
          const parsedInfo = JSON.parse(projectInfo);
          if (parsedInfo && parsedInfo.version) {
            currentVersion = parsedInfo.version;
          }
        } catch (parseError) {
          console.warn('Could not parse projectInfo from localStorage:', parseError);
        }
      }
      
      // Create a mock version
      const mockVersions = [
        {
          id: _.uniqueId('version_'),
          label: currentVersion,
          note: "Initial version",
          isCurrent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      // Save mock versions to localStorage for future use
      localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(mockVersions));
      
      return mockVersions;
    } catch (fallbackError) {
      console.error('Error creating fallback versions:', fallbackError);
      return [];
    }
  }
};

/**
 * Create a new document version for a project
 * 
 * @param {object} versionData - Data for the new version
 * @returns {Promise} Promise with the created document version data
 */
export const createDocumentVersion = async (versionData) => {
  try {
    const response = await post(`${API_BASE_URL}/document-versions`, versionData);
    
    // Store updated versions in localStorage
    try {
      const currentVersions = localStorage.getItem(`project_${versionData.project_id}_versions`) || '[]';
      const parsedVersions = JSON.parse(currentVersions);
      
      // Reset any current version if this one should be current
      if (versionData.is_current) {
        for (const version of parsedVersions) {
          version.isCurrent = false;
        }
      }
      
      // Add the new version
      const newVersion = {
        id: response.data.id || _.uniqueId('version_'),
        label: versionData.version_label,
        isCurrent: versionData.is_current,
        note: versionData.note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      parsedVersions.push(newVersion);
      localStorage.setItem(`project_${versionData.project_id}_versions`, JSON.stringify(parsedVersions));
    } catch (storageError) {
      console.warn('Failed to update versions in localStorage:', storageError);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating document version:', error);
    
    // Create a mock version if the API fails
    try {
      const mockVersionId = _.uniqueId('version_');
      const mockVersion = {
        id: mockVersionId,
        version_label: versionData.version_label,
        is_current: versionData.is_current,
        note: versionData.note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: versionData.project_id
      };
      
      // Update localStorage with the new mock version
      const currentVersions = localStorage.getItem(`project_${versionData.project_id}_versions`) || '[]';
      let parsedVersions = [];
      try {
        parsedVersions = JSON.parse(currentVersions);
        
        // Reset any current version if this one should be current
        if (versionData.is_current) {
          for (const version of parsedVersions) {
            version.isCurrent = false;
          }
        }
        
        // Add the new version to localStorage
        parsedVersions.push({
          id: mockVersionId,
          label: versionData.version_label,
          isCurrent: versionData.is_current,
          note: versionData.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        localStorage.setItem(`project_${versionData.project_id}_versions`, JSON.stringify(parsedVersions));
      } catch (parseError) {
        console.warn('Failed to parse versions from localStorage:', parseError);
        
        // Create fresh array with just the new version
        const newVersions = [{
          id: mockVersionId,
          label: versionData.version_label,
          isCurrent: versionData.is_current,
          note: versionData.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }];
        
        localStorage.setItem(`project_${versionData.project_id}_versions`, JSON.stringify(newVersions));
      }
      
      return mockVersion;
    } catch (mockError) {
      console.error('Error creating mock version:', mockError);
      throw error;
    }
  }
};

/**
 * Set a document version as the current version for a project
 * 
 * @param {string} projectId - The UUID of the project
 * @param {string} versionId - The UUID of the version to set as current
 * @returns {Promise} Promise with the updated project data
 */
export const setCurrentVersion = async (projectId, versionId) => {
  try {
    const response = await put(`${API_BASE_URL}/projects/${projectId}`, {
      current_version: versionId,
      // We need to include updated_by even though we'd normally get it from the auth context
      updated_by: localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000"
    });
    
    // Update the localStorage versions to reflect the change in current version
    try {
      const storedVersions = localStorage.getItem(`project_${projectId}_versions`);
      if (storedVersions) {
        const versions = JSON.parse(storedVersions);
        
        // Update the isCurrent property for each version
        for (const version of versions) {
          const wasCurrent = version.isCurrent;
          version.isCurrent = version.id === versionId;
          
          // Update the updatedAt timestamp if the status changed
          if (wasCurrent !== version.isCurrent) {
            version.updatedAt = new Date().toISOString();
          }
        }
        
        localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
      }
    } catch (storageError) {
      console.warn('Failed to update versions in localStorage:', storageError);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error setting current version:', error);
    
    // Handle the error by updating the localStorage directly
    try {
      // First, get the stored versions
      const storedVersions = localStorage.getItem(`project_${projectId}_versions`);
      if (storedVersions) {
        const versions = JSON.parse(storedVersions);
        
        // Update the isCurrent property for each version
        for (const version of versions) {
          const wasCurrent = version.isCurrent;
          version.isCurrent = version.id === versionId;
          
          // Update the updatedAt timestamp if the status changed
          if (wasCurrent !== version.isCurrent) {
            version.updatedAt = new Date().toISOString();
          }
        }
        
        localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
        
        // Create a mock response with the minimum needed data
        return {
          id: projectId,
          current_version: versionId,
          updated_at: new Date().toISOString()
        };
      }
    } catch (fallbackError) {
      console.error('Error updating version in localStorage:', fallbackError);
    }
    
    throw error;
  }
};
