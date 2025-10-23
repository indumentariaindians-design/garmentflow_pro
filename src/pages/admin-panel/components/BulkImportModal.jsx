import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const BulkImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);

  const sampleData = `Name,Email,Role,Department,Status
John Smith,john.smith@garmentflow.com,manager,production,active
Sarah Johnson,sarah.johnson@garmentflow.com,ventas,sales,active
Mike Wilson,mike.wilson@garmentflow.com,station,production,active
Lisa Brown,lisa.brown@garmentflow.com,admin,administration,active`;

  const handleFileChange = (e) => {
    const selectedFile = e?.target?.files?.[0];
    if (selectedFile && selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      setErrors(['Please select a valid CSV file']);
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e?.target?.result;
      const lines = text?.split('\n');
      const headers = lines?.[0]?.split(',')?.map(h => h?.trim());
      
      const data = lines?.slice(1)?.filter(line => line?.trim())?.map((line, index) => {
          const values = line?.split(',')?.map(v => v?.trim());
          const row = {};
          headers?.forEach((header, i) => {
            row[header.toLowerCase()] = values?.[i] || '';
          });
          row.lineNumber = index + 2;
          return row;
        });

      setPreviewData(data);
      validateData(data);
    };
    reader?.readAsText(file);
  };

  const validateData = (data) => {
    const validationErrors = [];
    const validRoles = ['admin', 'manager', 'ventas', 'station'];
    const validDepartments = ['production', 'sales', 'administration', 'quality'];
    const validStatuses = ['active', 'inactive'];

    data?.forEach((row) => {
      if (!row?.name) {
        validationErrors?.push(`Line ${row?.lineNumber}: Name is required`);
      }
      
      if (!row?.email || !/\S+@\S+\.\S+/?.test(row?.email)) {
        validationErrors?.push(`Line ${row?.lineNumber}: Valid email is required`);
      }
      
      if (!validRoles?.includes(row?.role?.toLowerCase())) {
        validationErrors?.push(`Line ${row?.lineNumber}: Invalid role. Must be one of: ${validRoles?.join(', ')}`);
      }
      
      if (!validDepartments?.includes(row?.department?.toLowerCase())) {
        validationErrors?.push(`Line ${row?.lineNumber}: Invalid department. Must be one of: ${validDepartments?.join(', ')}`);
      }
      
      if (row?.status && !validStatuses?.includes(row?.status?.toLowerCase())) {
        validationErrors?.push(`Line ${row?.lineNumber}: Invalid status. Must be one of: ${validStatuses?.join(', ')}`);
      }
    });

    setErrors(validationErrors);
  };

  const handleImport = async () => {
    if (errors?.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onImport(previewData);
      onClose();
      resetModal();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
  };

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_sample.csv';
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Import Employees</h2>
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Import Instructions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Upload a CSV file with employee data. Required columns: Name, Email, Role, Department. Optional: Status (defaults to active).
                </p>
                <button
                  onClick={downloadSample}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 inline-flex items-center space-x-1"
                >
                  <Icon name="Download" size={16} />
                  <span>Download sample CSV</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <Input
              label="CSV File"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              description="Select a CSV file containing employee data"
            />
          </div>

          {errors?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} className="text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-900">Validation Errors</h3>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    {errors?.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {previewData?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preview ({previewData?.length} employees)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData?.slice(0, 10)?.map((row, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{row?.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row?.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row?.role}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row?.department}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row?.status || 'active'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData?.length > 10 && (
                  <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    ... and {previewData?.length - 10} more employees
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              resetModal();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            loading={isLoading}
            disabled={!file || errors?.length > 0 || previewData?.length === 0}
            iconName="Upload"
          >
            Import {previewData?.length} Employees
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;