// filepath: src/pages/ProjectArtifactsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getProjectArtifacts, getArtifactFileContent } from '../services/projectArtifactsService';
import { Card } from '../components/ui';
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';

const ProjectArtifactsPage = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [artifactContent, setArtifactContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get projectId from URL params or from localStorage
  const { projectId } = useParams();
  const location = useLocation();
  
  // Get the current project ID from params or localStorage
  const getCurrentProjectId = () => {
    const fromParams = projectId;
    if (fromParams) return fromParams;
    
    // Try to get from localStorage
    try {
      const projectInfo = localStorage.getItem('projectInfo');
      if (!projectInfo) return null;
      
      return _.get(JSON.parse(projectInfo), 'id');
    } catch (err) {
      console.error("Error parsing project info:", err);
      return null;
    }
  };

  // Fetch the content of a selected artifact
  const fetchArtifactContent = async (artifact) => {
    try {
      setContentLoading(true);
      const currentProjectId = getCurrentProjectId();
      
      if (!artifact || !artifact.file_path || !currentProjectId) {
        throw new Error('Missing required information to fetch artifact content');
      }
      
      const content = await getArtifactFileContent(currentProjectId, artifact.file_path);
      setArtifactContent(content);
    } catch (err) {
      console.error('Error fetching artifact content:', err);
      setArtifactContent('Failed to load content: ' + (err.message || 'Unknown error'));
    } finally {
      setContentLoading(false);
    }
  };
  
  // Fetch the list of artifacts
  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        setLoading(true);
        const currentProjectId = getCurrentProjectId();
        
        if (!currentProjectId) {
          throw new Error('No project selected');
        }
        
        const data = await getProjectArtifacts(currentProjectId);
        setArtifacts(data);
        
        // Select the first artifact by default if available
        if (data && data.length > 0) {
          setSelectedArtifact(data[0]);
          // Also fetch its content
          await fetchArtifactContent(data[0]);
        }
      } catch (err) {
        console.error('Error fetching project artifacts:', err);
        setError(err.message || 'Failed to load project artifacts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtifacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, location]);
  
  const handleArtifactSelect = (artifact) => {
    setSelectedArtifact(artifact);
    fetchArtifactContent(artifact);
  };
  
  // Function to determine artifact type based on metadata
  const getArtifactType = (artifact) => {
    // Try to get type from artifact_type property first
    const artifactType = _.get(artifact, 'artifact_type', '').toLowerCase();
    
    if (artifactType === 'checklist') return 'Checklist';
    if (artifactType === 'testcases') return 'Test Cases';
    
    // Fall back to checking the file path
    const filePath = _.get(artifact, 'file_path', '').toLowerCase();
    
    if (filePath.includes('checklist')) return 'Checklist';
    if (filePath.includes('testcase') || filePath.includes('test-case') || filePath.includes('test_case')) return 'Test Cases';
    
    return 'Document';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 font-semibold mb-2">Error loading artifacts</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Project Artifacts</h1>
      
      {artifacts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">No artifacts found for this project</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with artifacts list */}
          <div className="col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Project Files</h2>
            </div>
            <ul>
              {artifacts.map((artifact) => (
                <li 
                  key={artifact.id} 
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedArtifact?.id === artifact.id ? 'bg-gray-100 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleArtifactSelect(artifact)}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {_.get(artifact, 'file_path', '').split('/').pop() || 'Untitled'}
                    </span>
                    <span className="ml-auto text-xs bg-gray-200 rounded-full px-2 py-1">
                      {getArtifactType(artifact)}
                    </span>
                  </div>
                  {artifact.note && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{artifact.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Main content area */}
          <div className="col-span-1 md:col-span-3">
            {selectedArtifact ? (
              <Card className="p-6">
                <div className="mb-4 pb-4 border-b">
                  <h2 className="text-xl font-bold">
                    {_.get(selectedArtifact, 'file_path', '').split('/').pop() || 'Untitled Document'}
                  </h2>
                  <div className="flex mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2">
                      {getArtifactType(selectedArtifact)}
                    </span>
                    {selectedArtifact.created_at && (
                      <span className="text-xs text-gray-500">
                        Created: {new Date(selectedArtifact.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {selectedArtifact.note && (
                    <p className="text-sm text-gray-600 mt-2">{selectedArtifact.note}</p>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  {/* Show loading indicator while fetching content */}
                  {contentLoading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Display markdown content */}
                  {!contentLoading && artifactContent && (
                    <ReactMarkdown>{artifactContent}</ReactMarkdown>
                  )}
                  
                  {/* If no content available */}
                  {!contentLoading && !artifactContent && (
                    <p className="text-gray-500 italic">This document has no content</p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600">Select an artifact to view its content</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectArtifactsPage;
