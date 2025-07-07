import _ from 'lodash';
import { API_BASE_URL } from '../configs/UrlConfig';
import { get, post, put } from '../configs/RequestConfig';

// Types
export interface DocumentVersion {
  id: string;
  label: string;
  isCurrent: boolean;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface RawDocumentVersion {
  id: string;
  version_label?: string;
  is_current: boolean;
  note: string;
  created_at: string;
  updated_at: string;
}

interface VersionPayload {
  project_id: string;
  version_label: string;
  is_current: boolean;
  note: string;
}

/**
 * Fetch all document versions for a specific project.
 */
export const getDocumentVersionsByProject = async (
  projectId: string
): Promise<DocumentVersion[]> => {
  if (!projectId) return [];

  try {
    const response = await get(`${API_BASE_URL}/document-versions/project/${projectId}`);

    const versions: DocumentVersion[] = _.map(response.data as RawDocumentVersion[], (version) => ({
      id: version.id,
      label: version.version_label || `v${version.id.substring(0, 6)}`,
      isCurrent: version.is_current,
      note: version.note,
      createdAt: version.created_at,
      updatedAt: version.updated_at,
    }));

    localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
    return _.sortBy(versions, ['label']);
  } catch (error) {
    console.error('Error fetching document versions:', error);

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`project_${projectId}_versions`);
      if (stored) return JSON.parse(stored);

      // Fallback to default mock version
      const projectInfo = localStorage.getItem('projectInfo');
      let versionLabel = 'v1.0.0';

      if (projectInfo) {
        try {
          const parsed = JSON.parse(projectInfo);
          if (parsed?.version) versionLabel = parsed.version;
        } catch (parseError) {
          console.warn('Failed to parse projectInfo:', parseError);
        }
      }

      const mockVersion: DocumentVersion[] = [
        {
          id: _.uniqueId('version_'),
          label: versionLabel,
          note: 'Initial version',
          isCurrent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(mockVersion));
      return mockVersion;
    } catch (fallbackError) {
      console.error('Error creating fallback versions:', fallbackError);
      return [];
    }
  }
};

/**
 * Create a new document version for a project.
 */
export const createDocumentVersion = async (
  versionData: VersionPayload
): Promise<DocumentVersion> => {
  try {
    const response = await post(`${API_BASE_URL}/document-versions`, versionData);

    const newVersion: DocumentVersion = {
      id: response.data.id || _.uniqueId('version_'),
      label: versionData.version_label,
      isCurrent: versionData.is_current,
      note: versionData.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const local = localStorage.getItem(`project_${versionData.project_id}_versions`) || '[]';
      const versions: DocumentVersion[] = JSON.parse(local);

      if (versionData.is_current) {
        for (const v of versions) v.isCurrent = false;
      }

      versions.push(newVersion);
      localStorage.setItem(`project_${versionData.project_id}_versions`, JSON.stringify(versions));
    } catch (e) {
      console.warn('Failed to update versions in localStorage:', e);
    }

    return newVersion;
  } catch (error) {
    console.error('Error creating document version:', error);

    try {
      const mockVersion: DocumentVersion = {
        id: _.uniqueId('version_'),
        label: versionData.version_label,
        isCurrent: versionData.is_current,
        note: versionData.note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const current = localStorage.getItem(`project_${versionData.project_id}_versions`) || '[]';
      let versions: DocumentVersion[];

      try {
        versions = JSON.parse(current);
        if (versionData.is_current) {
          for (const v of versions) v.isCurrent = false;
        }
        versions.push(mockVersion);
      } catch {
        versions = [mockVersion];
      }

      localStorage.setItem(`project_${versionData.project_id}_versions`, JSON.stringify(versions));
      return {
        ...mockVersion,
        // Mock only — no backend ID
        id: mockVersion.id,
      };
    } catch (mockError) {
      console.error('Error creating mock version:', mockError);
      throw error;
    }
  }
};

/**
 * Set a document version as the current one.
 */
export const setCurrentVersion = async (
  projectId: string,
  versionId: string
): Promise<{ id: string; current_version: string; updated_at: string }> => {
  try {
    const response = await put(`${API_BASE_URL}/projects/${projectId}`, {
      current_version: versionId,
      updated_by: localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000',
    });

    try {
      const stored = localStorage.getItem(`project_${projectId}_versions`);
      if (stored) {
        const versions: DocumentVersion[] = JSON.parse(stored);
        for (const version of versions) {
          const wasCurrent = version.isCurrent;
          version.isCurrent = version.id === versionId;
          if (wasCurrent !== version.isCurrent) {
            version.updatedAt = new Date().toISOString();
          }
        }
        localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
      }
    } catch (e) {
      console.warn('Failed to update versions in localStorage:', e);
    }

    return response.data;
  } catch (error) {
    console.error('Error setting current version:', error);

    try {
      const stored = localStorage.getItem(`project_${projectId}_versions`);
      if (stored) {
        const versions: DocumentVersion[] = JSON.parse(stored);
        for (const version of versions) {
          const wasCurrent = version.isCurrent;
          version.isCurrent = version.id === versionId;
          if (wasCurrent !== version.isCurrent) {
            version.updatedAt = new Date().toISOString();
          }
        }

        localStorage.setItem(`project_${projectId}_versions`, JSON.stringify(versions));
        return {
          id: projectId,
          current_version: versionId,
          updated_at: new Date().toISOString(),
        };
      }
    } catch (fallbackError) {
      console.error('Error in fallback for setting current version:', fallbackError);
    }

    throw error;
  }
};
