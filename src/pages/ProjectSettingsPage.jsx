// filepath: src/pages/ProjectSettingsPage.jsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Settings, PlusCircle, RefreshCw } from 'lucide-react';
import FormDialog from '../components/ui/FormDialog';
import { getDocumentVersionsByProject, createDocumentVersion, setCurrentVersion } from '../services/documentVersionService';
import _ from 'lodash';

const ProjectSettingsPage = () => {
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdatingCurrent, setIsUpdatingCurrent] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const loadProjectData = () => {
      // Get project data from localStorage
      const storedProject = localStorage.getItem("projectInfo");
      if (!storedProject) return;
      
      try {
        // Use lodash's attempt to safely try parsing JSON
        const parsed = _.attempt(JSON.parse, storedProject);
        
        if (!_.isError(parsed) && _.has(parsed, 'id')) {
          setCurrentProject(parsed);
          fetchVersions(parsed.id);
        } else {
          // Legacy format - just the ID
          const projectId = _.isError(parsed) ? storedProject : parsed;
          setCurrentProject({ id: projectId });
          fetchVersions(projectId);
        }
      } catch (error) {
        console.error("Error loading project data:", error);
      }
    };

    loadProjectData();
  }, []);

  const fetchVersions = async (projectId) => {
    setIsLoading(true);
    try {
      // Use the enhanced getDocumentVersionsByProject which handles API errors internally
      const versionsList = await getDocumentVersionsByProject(projectId);
      setVersions(versionsList);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
      // Show error message to the user
      alert("There was an error loading project versions. Please try again later.");
      setVersions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVersion = async (formData) => {
    try {
      if (!currentProject?.id) {
        throw new Error("No project selected");
      }
      
      // Prepare version data
      const versionData = {
        project_id: currentProject.id,
        version_label: formData.version_label,
        is_current: formData.is_current,
        note: formData.note || null,
        // These would normally come from the authentication context
        created_by: localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000",
        updated_by: localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000"
      };
      
      // Create the version
      const newVersion = await createDocumentVersion(versionData);
      
      // If this should be the current version, update the project
      if (formData.is_current) {
        await setCurrentVersion(currentProject.id, newVersion.id);
        
        // Update localStorage with new version info
        if (_.isObject(currentProject)) {
          const updatedProject = {
            ...currentProject,
            version: formData.version_label
          };
          localStorage.setItem("projectInfo", JSON.stringify(updatedProject));
          setCurrentProject(updatedProject);
        }
      }
      
      // Refresh versions list
      await fetchVersions(currentProject.id);
      
      // Close the dialog
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating version:", error);
      alert("Failed to create version. Please try again.");
    }
  };

  const handleSetCurrentVersion = async (versionId, versionLabel) => {
    if (!currentProject?.id) return;
    
    // Avoid multiple requests
    if (isUpdatingCurrent) return;
    
    setIsUpdatingCurrent(true);
    try {
      await setCurrentVersion(currentProject.id, versionId);
      
      // Update localStorage with new version info
      if (_.isObject(currentProject)) {
        const updatedProject = {
          ...currentProject,
          version: versionLabel
        };
        localStorage.setItem("projectInfo", JSON.stringify(updatedProject));
        setCurrentProject(updatedProject);
      }
      
      // Refresh the versions list
      await fetchVersions(currentProject.id);
      
    } catch (error) {
      console.error("Error setting current version:", error);
      alert("Failed to update current version. Please try again.");
    } finally {
      setIsUpdatingCurrent(false);
    }
  };

  const versionSchema = {
    version_label: {
      label: "Version Label",
      validate: (v) => {
        if (!v) return "Version label is required";
        
        // Check for valid version format: vx, vx.x, or vx.x.x
        const versionPattern = /^v\d+(\.\d+){0,2}$/;
        if (!versionPattern.test(v)) {
          return "Version must be in format vx, vx.x, or vx.x.x (e.g., v1, v1.2, v1.2.3)";
        }
        
        return null;
      },
      defaultValue: "",
      placeholder: "e.g., v1.0, v2.1.3"
    },
    note: {
      label: "Version Notes",
      type: "textarea",
      defaultValue: "",
      placeholder: "Description of changes in this version"
    },
    is_current: {
      label: "Set as Current Version",
      type: "checkbox",
      defaultValue: false,
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6" />
          <CardTitle>Project Settings</CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => fetchVersions(currentProject?.id)}
            variant="outline"
            className="flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Version
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Project Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Project Information</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentProject?.name || "Unknown Project"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Version</p>
                <p className="font-medium">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {currentProject?.version || "v0"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Versions List */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Version History</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : versions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {_.map(versions, (version) => (
                    <tr key={version.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-md">
                          {version.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {version.note || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {version.isCurrent ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Current
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Historical
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!version.isCurrent && (
                          <button
                            onClick={() => handleSetCurrentVersion(version.id, version.label)}
                            disabled={isUpdatingCurrent}
                            className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                          >
                            {isUpdatingCurrent ? 'Setting...' : 'Set as Current'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 text-center rounded-md">
              <p className="text-gray-500">No versions found for this project.</p>
              <p className="mt-2 text-sm text-gray-400">Click "Create Version" to add a new version.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {isCreateDialogOpen && (
        <FormDialog
          title="New Version Tag"
          formSchema={versionSchema}
          initialFormData={{}}
          onSubmit={handleCreateVersion}
          onClose={() => setIsCreateDialogOpen(false)}
          renderFieldOverride={{
            version_label: (key, cfg, form, setForm) => (
              <div className="space-y-1">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {cfg.label}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={form[key]}
                  onChange={e => {
                    const newValue = e.target.value;
                    setForm(prev => ({ ...prev, [key]: newValue }));
                  }}
                  placeholder={cfg.placeholder}
                  className="block w-full rounded-md px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: v1, v1.0, or v1.0.0
                </p>
              </div>
            )
          }}
        />
      )}
    </Card>
  );
};

export default ProjectSettingsPage;
