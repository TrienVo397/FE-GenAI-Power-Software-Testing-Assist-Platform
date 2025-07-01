// filepath: src/components/fileexplorer/FileExplorer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import FileItem from './FileItem';
import FileContextMenu from './FileContextMenu';
import FileCreateDialog from './FileCreateDialog';
import FileUploadDialog from './FileUploadDialog';
import FileViewerDialog from './FileViewerDialog';
import FileEditorDialog from './FileEditorDialog';
import { BASE_URL } from '../../configs/UrlConfig';
import { 
  listFiles, 
  getFileContent, 
  getFileContentAsJson,
  uploadFile, 
  deleteFile, 
  createDirectory,
  updateFileContent,
  isEditableFile
} from '../../services/fileExplorerService';

const FileExplorer = ({ projectId }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Context Menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    item: null,
  });
  
  // Dialog states
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFileDialog, setNewFileDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [viewerDialog, setViewerDialog] = useState({
    open: false,
    file: null,
    content: null,
  });
  
  // File editor dialog state
  const [editorDialog, setEditorDialog] = useState({
    open: false,
    file: null,
    content: null,
  });
  
  // Path history for back/forward navigation
  const [pathHistory, setPathHistory] = useState(['/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  // Define fetchFiles with useCallback to prevent unnecessary re-renders
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Normalize currentPath to ensure it's valid
      const directory = currentPath === '/' ? null : currentPath;
      
      // Fetch files from the API
      const filesList = await listFiles(projectId, directory, false, false);
      
      // Sort files: directories first, then by name
      const sortedFiles = _.orderBy(
        filesList,
        [
          (item) => item.type !== 'directory',  // directories first
          (item) => _.toLower(item.name),       // then by name (case insensitive)
        ],
        ['asc', 'asc']
      );
      
      setFiles(sortedFiles);
    } catch (err) {
      setError('Failed to load files. Please try again.');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, currentPath]);
    // Fetch files on initial load and when path changes
  useEffect(() => {
    if (projectId) {
      fetchFiles();
    }
  }, [projectId, fetchFiles]);
  
  const handleFileSelect = async (file) => {
    // Set as selected
    setSelectedFile(file);
    
    // If it's a directory, navigate into it
    if (file.type === 'directory') {
      navigateTo(file.path);
    } else {
      // If it's a file, show the viewer
      try {
        setLoading(true);
        const fileData = await getFileContent(projectId, file.path);
        setViewerDialog({
          open: true,
          file,
          content: fileData
        });
      } catch (err) {
        setError(`Failed to open file: ${file.name}`);
        console.error('Error opening file:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const navigateTo = (path) => {
    // Update history when navigating to a new path
    const newHistory = [...pathHistory.slice(0, historyIndex + 1), path];
    setPathHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };
  
  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(pathHistory[historyIndex - 1]);
    }
  };
  
  const handleGoForward = () => {
    if (historyIndex < pathHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(pathHistory[historyIndex + 1]);
    }
  };
  
  const handleGoUp = () => {
    if (currentPath === '/') return;
    
    // Get parent directory path
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop(); // Remove last part
    const parentPath = pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
    
    navigateTo(parentPath);
  };
  
  const handleRefresh = () => {
    fetchFiles();
  };
  
  // Context Menu handlers
  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: event.clientX, y: event.clientY },
      item,
    });
  };
  
  const handleCloseContextMenu = () => {
    setContextMenu({
      visible: false,
      position: { x: 0, y: 0 },
      item: null,
    });
  };
  
  // File operations
  const handleCreateFolder = async (name) => {
    try {
      setLoading(true);
      const folderPath = currentPath === '/' 
        ? name
        : `${currentPath}/${name}`;
      
      await createDirectory(projectId, folderPath);
      fetchFiles();
    } catch (err) {
      setError(`Failed to create folder: ${name}`);
      console.error('Error creating folder:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateFile = async (name) => {
    try {
      setLoading(true);
      
      // Create an empty file using upload API
      const filePath = currentPath === '/' 
        ? name
        : `${currentPath}/${name}`;
      
      const emptyBlob = new Blob([''], { type: 'text/plain' });
      const emptyFile = new File([emptyBlob], name, { type: 'text/plain' });
      
      await uploadFile(projectId, filePath, emptyFile);
      fetchFiles();
    } catch (err) {
      setError(`Failed to create file: ${name}`);
      console.error('Error creating file:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteFile = async (file) => {
    if (!file) return;
    
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        setLoading(true);
        await deleteFile(projectId, file.path);
        
        // Clear selected file if it's the one being deleted
        if (selectedFile && selectedFile.path === file.path) {
          setSelectedFile(null);
        }
        
        fetchFiles();
      } catch (err) {
        setError(`Failed to delete: ${file.name}`);
        console.error('Error deleting file:', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleUploadFiles = async (files, targetPath) => {
    if (!files || !files.length) return;
    
    try {
      setLoading(true);
      
      // Upload each file
      for (const file of files) {
        const filePath = targetPath === '/' 
          ? file.name 
          : `${targetPath}/${file.name}`;
        
        await uploadFile(projectId, filePath, file);
      }
      
      fetchFiles();
    } catch (err) {
      setError('Failed to upload one or more files');
      console.error('Error uploading files:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file download
  const handleDownloadFile = async (file) => {
    if (!file || !projectId) {
      setError("Cannot download: Missing file information or project ID");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make sure file path exists and is properly formatted
      if (!file.path) {
        throw new Error('File path is undefined');
      }
      
      // Use our authenticated service to get the file content as binary data
      const fileContent = await getFileContent(projectId, file.path, true);
      
      // Determine file type (for binary files)
      let mimeType = 'application/octet-stream';
      
      // Try to infer MIME type from file extension
      const fileExtension = _.toLower(file.name.split('.').pop());
      if (fileExtension) {
        const mimeTypes = {
          'txt': 'text/plain',
          'html': 'text/html',
          'css': 'text/css',
          'js': 'application/javascript',
          'json': 'application/json',
          'xml': 'application/xml',
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          'zip': 'application/zip',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        
        if (mimeTypes[fileExtension]) {
          mimeType = mimeTypes[fileExtension];
        }
      }
      
      // Create a blob from the file content with proper handling of binary data
      const blob = new Blob([fileContent], { type: mimeType });
      
      // Create a download link using the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (err) {
      setError(`Failed to download file: ${file?.name || 'Unknown file'}`);
      console.error('Error downloading file:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file editing
  const handleEditFile = async (file) => {
    if (!file || !isEditableFile(file.name)) {
      setError(`File type '${file.name}' is not supported for editing`);
      return;
    }

    try {
      setLoading(true);
      const fileData = await getFileContentAsJson(projectId, file.path);
      setEditorDialog({
        open: true,
        file,
        content: fileData.content
      });
      
      // Close viewer dialog if open
      setViewerDialog({
        open: false,
        file: null,
        content: null
      });
    } catch (err) {
      setError(`Failed to load file for editing: ${file.name}`);
      console.error('Error loading file for editing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async (content, description) => {
    if (!editorDialog.file) return;

    try {
      setLoading(true);
      await updateFileContent(projectId, editorDialog.file.path, content, description);
      
      // Close editor
      setEditorDialog({
        open: false,
        file: null,
        content: null
      });

      // Refresh file list to update modification times
      fetchFiles();
    } catch (err) {
      setError(`Failed to save file: ${editorDialog.file.name}`);
      console.error('Error saving file:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Context menu actions
  const getContextMenuActions = (item) => {
    // Return empty array if item is null
    if (!item) {
      return [];
    }

    // Common actions
    const actions = [
      { 
        label: 'Delete', 
        icon: '🗑️', 
        onClick: (item) => handleDeleteFile(item) 
      },
    ];
    
    // Add type-specific actions
    if (item?.type === 'directory') {
      return [
        { 
          label: 'Open', 
          icon: '📂', 
          onClick: (item) => handleFileSelect(item) 
        },
        { 
          label: 'New File', 
          icon: '📄', 
          onClick: () => setNewFileDialog(true)
        },
        { 
          label: 'New Folder', 
          icon: '📁', 
          onClick: () => setNewFolderDialog(true) 
        },
        { 
          label: 'Upload Files', 
          icon: '📤', 
          onClick: () => setUploadDialog(true) 
        },
        ...actions
      ];
    } else {
      const fileActions = [
        { 
          label: 'Open', 
          icon: '📄', 
          onClick: (item) => handleFileSelect(item) 
        },
        { 
          label: 'Download', 
          icon: '📥', 
          onClick: (item) => handleDownloadFile(item) 
        }
      ];

      // Add edit option for editable files (with null check)
      if (item?.name && isEditableFile(item.name)) {
        fileActions.splice(1, 0, {
          label: 'Edit',
          icon: '✏️',
          onClick: (item) => handleEditFile(item)
        });
      }

      return [
        ...fileActions,
        { 
          label: 'Delete', 
          icon: '🗑️', 
          onClick: (item) => handleDeleteFile(item) 
        }
      ];
    }
  };
  
  // Build breadcrumb navigation
  const getBreadcrumbs = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center overflow-x-auto py-2 text-sm">
        <div 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigateTo('/')}
        >
          Home
        </div>
        
        {pathParts.map((part, index) => {
          const path = '/' + pathParts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <span className="mx-1">/</span>
              <div 
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigateTo(path)}
              >
                {part}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b">
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={handleGoBack}
          disabled={historyIndex === 0}
          title="Back"
        >
          ⬅️
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={handleGoForward}
          disabled={historyIndex === pathHistory.length - 1}
          title="Forward"
        >
          ➡️
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={handleGoUp}
          disabled={currentPath === '/'}
          title="Up"
        >
          ⬆️
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={handleRefresh}
          title="Refresh"
        >
          🔄
        </button>
        <div className="flex-grow">
          {getBreadcrumbs()}
        </div>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => setNewFileDialog(true)}
          title="New File"
        >
          📄
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => setNewFolderDialog(true)}
          title="New Folder"
        >
          📁
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100"
          onClick={() => setUploadDialog(true)}
          title="Upload"
        >
          📤
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-2 rounded">
          {error}
        </div>
      )}
      
      {/* File list */}
      <div className="flex-grow overflow-auto p-2">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            This folder is empty
          </div>
        ) : (
          files.map((file) => (
            <FileItem
              key={file.path}
              item={file}
              onSelect={handleFileSelect}
              isSelected={selectedFile && selectedFile.path === file.path}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </div>
      
      {/* Context Menu */}
      <FileContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        actions={getContextMenuActions(contextMenu.item)}
        item={contextMenu.item}
      />
      
      {/* New Folder Dialog */}
      <FileCreateDialog
        open={newFolderDialog}
        onClose={() => setNewFolderDialog(false)}
        onConfirm={handleCreateFolder}
        title="Create New Folder"
        isFolder={true}
        currentPath={currentPath}
      />
      
      {/* New File Dialog */}
      <FileCreateDialog
        open={newFileDialog}
        onClose={() => setNewFileDialog(false)}
        onConfirm={handleCreateFile}
        title="Create New File"
        isFolder={false}
        currentPath={currentPath}
      />
      
      {/* Upload Dialog */}
      <FileUploadDialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
        onConfirm={handleUploadFiles}
        currentPath={currentPath}
      />
      
      {/* File Viewer Dialog */}
      <FileViewerDialog
        open={viewerDialog.open}
        onClose={() => setViewerDialog({
          open: false,
          file: null,
          content: null
        })}
        file={viewerDialog.file}
        content={viewerDialog.content}
        onEdit={handleEditFile}
      />

      {/* File Editor Dialog */}
      <FileEditorDialog
        open={editorDialog.open}
        onClose={() => setEditorDialog({
          open: false,
          file: null,
          content: null
        })}
        onSave={handleSaveFile}
        file={editorDialog.file}
        content={editorDialog.content}
        loading={loading}
      />
      
      {/* File Editor Dialog */}
      <FileEditorDialog
        open={editorDialog.open}
        onClose={() => setEditorDialog({
          open: false,
          file: null,
          content: null
        })}
        file={editorDialog.file}
        content={editorDialog.content}
        onSave={handleSaveFile}
      />
    </div>
  );
};

export default FileExplorer;
