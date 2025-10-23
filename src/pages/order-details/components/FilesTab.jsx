import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FilesTab = ({ files, onFileUpload, onFileDelete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFiles = (fileList) => {
    Array.from(fileList)?.forEach(file => {
      onFileUpload(file);
    });
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image';
    if (type?.includes('pdf')) return 'FileText';
    if (type?.includes('document') || type?.includes('word')) return 'FileText';
    if (type?.includes('spreadsheet') || type?.includes('excel')) return 'FileSpreadsheet';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type?.startsWith('image/')) return 'text-green-600 bg-green-100';
    if (type?.includes('pdf')) return 'text-red-600 bg-red-100';
    if (type?.includes('document')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Order Files</h3>
        <div className="flex gap-2">
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(e?.target?.files)}
            className="hidden"
            id="file-upload"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" iconName="Upload" iconPosition="left" size="sm" asChild>
              <span>Upload Files</span>
            </Button>
          </label>
        </div>
      </div>
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' :'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Drop files here to upload</p>
        <p className="text-sm text-gray-600 mb-4">
          Supports images, PDFs, documents, and spreadsheets up to 10MB
        </p>
        <label htmlFor="file-upload">
          <Button variant="outline" size="sm" asChild>
            <span>Choose Files</span>
          </Button>
        </label>
      </div>
      {/* Files Grid */}
      {files?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files?.map((file) => (
            <div key={file?.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file?.type)}`}>
                  <Icon name={getFileIcon(file?.type)} size={20} />
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="Eye"
                    onClick={() => setSelectedFile(file)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="Download"
                    onClick={() => window.open(file?.url, '_blank')}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="Trash2"
                    onClick={() => onFileDelete(file?.id)}
                  />
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-1 truncate" title={file?.name}>
                {file?.name}
              </h4>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{formatFileSize(file?.size)}</span>
                <span>{file?.uploadedAt}</span>
              </div>
              
              {file?.uploadedBy && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon name="User" size={12} />
                  <span>{file?.uploadedBy}</span>
                </div>
              )}
              
              {file?.category && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {file?.category}
                  </span>
                </div>
              )}

              {/* Preview for images */}
              {file?.type?.startsWith('image/') && (
                <div className="mt-3 rounded overflow-hidden">
                  <Image 
                    src={file?.url} 
                    alt={file?.alt}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</p>
          <p className="text-sm text-gray-600">Upload production documents, quality photos, or design files</p>
        </div>
      )}
      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedFile?.name}</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Download"
                  onClick={() => window.open(selectedFile?.url, '_blank')}
                >
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="X"
                  onClick={() => setSelectedFile(null)}
                />
              </div>
            </div>
            
            <div className="p-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              {selectedFile?.type?.startsWith('image/') ? (
                <Image 
                  src={selectedFile?.url} 
                  alt={selectedFile?.alt}
                  className="w-full h-auto max-h-full object-contain"
                />
              ) : (
                <div className="text-center py-12">
                  <Icon name={getFileIcon(selectedFile?.type)} size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">{selectedFile?.name}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatFileSize(selectedFile?.size)} • {selectedFile?.type}
                  </p>
                  <Button 
                    variant="outline" 
                    iconName="ExternalLink"
                    onClick={() => window.open(selectedFile?.url, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesTab;