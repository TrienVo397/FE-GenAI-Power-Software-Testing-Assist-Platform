// filepath: src/pages/FileExplorerPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import FileExplorer from "../components/fileexplorer/FileExplorer";

const FileExplorerPage = () => {
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    // If projectId not available in URL params, try to get from localStorage
    const storedProjectId = projectId || localStorage.getItem("projectInfo");
    
    if (storedProjectId) {
      // Project ID might be stored directly as a string or as part of a JSON object
      const parsed = _.attempt(JSON.parse, storedProjectId);
      const id = !_.isError(parsed) && _.has(parsed, 'id') ? parsed.id : storedProjectId;
      
      setCurrentProject(id);
    }
  }, [projectId]);

  if (!currentProject) {
    return (
      <Card className="max-w-[90%] mx-auto">
        <CardHeader>
          <CardTitle>File Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-4">No Project Selected</h3>
            <p className="text-gray-500">
              Please select a project to view its files.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-[90%] mx-auto h-[80vh]">
      <CardHeader className="pb-2">
        <CardTitle>File Explorer</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <FileExplorer projectId={currentProject} />
      </CardContent>
    </Card>
  );
};

export default FileExplorerPage;
