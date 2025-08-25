import { useState, useRef, useCallback } from 'react';
import { HiUpload, HiX, HiDocument, HiPhotograph } from 'react-icons/hi';
import { useChat } from '../utils/contextApi';

const FileUpload = ({ onUpload, onCancel }) => {
  const { darkMode } = useChat();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|txt)$/i.test(file.name);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only images, PDFs, and documents under 10MB are allowed.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const progress = {};
    
    // Simulate upload progress for each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      progress[file.name] = 0;
      
      // Simulate progress updates
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        progress[file.name] = p;
        setUploadProgress({ ...progress });
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUploading(false);
    
    // Process uploaded files
    selectedFiles.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const fileData = {
        type: isImage ? 'image' : 'file',
        fileName: file.name,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file), // In real app, this would be the uploaded URL
        content: `Sent ${isImage ? 'an image' : 'a file'}: ${file.name}`
      };
      
      onUpload(fileData);
    });
    
    setSelectedFiles([]);
    setUploadProgress({});
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <HiPhotograph className="w-8 h-8 text-blue-500" />;
    }
    return <HiDocument className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold">Upload Files</h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Drag and Drop Zone */}
          <div
            ref={dropRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : darkMode
                  ? 'border-gray-600 bg-gray-700'
                  : 'border-gray-300 bg-gray-50'
            }`}
          >
            <HiUpload className={`w-12 h-12 mx-auto mb-4 ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className="text-sm mb-2">
              Drag and drop files here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:underline"
              >
                browse
              </button>
            </p>
            <p className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Supports: JPG, PNG, GIF, PDF, DOC, TXT (Max: 10MB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatFileSize(file.size)}
                      </p>
                      {uploadProgress[file.name] !== undefined && (
                        <div className="mt-1">
                          <div className={`w-full bg-gray-200 rounded-full h-2 ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {uploadProgress[file.name]}%
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end space-x-2 p-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={simulateUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFiles.length === 0 || uploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
