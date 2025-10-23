import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SystemConfigSection = () => {
  const [config, setConfig] = useState({
    companyName: 'GarmentFlow Pro',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    auditLogging: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordExpiry: '90'
  });

  const [isLoading, setIsLoading] = useState(false);

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuration saved:', config);
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSeedData = async () => {
    setIsLoading(true);
    try {
      // Simulate seed data generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Seed data generated successfully');
    } catch (error) {
      console.error('Error generating seed data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            type="text"
            value={config?.companyName}
            onChange={(e) => handleConfigChange('companyName', e?.target?.value)}
            placeholder="Enter company name"
          />

          <Select
            label="Timezone"
            options={timezoneOptions}
            value={config?.timezone}
            onChange={(value) => handleConfigChange('timezone', value)}
          />

          <Select
            label="Default Currency"
            options={currencyOptions}
            value={config?.currency}
            onChange={(value) => handleConfigChange('currency', value)}
          />

          <Select
            label="Default Language"
            options={languageOptions}
            value={config?.language}
            onChange={(value) => handleConfigChange('language', value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Send system notifications via email"
            checked={config?.emailNotifications}
            onChange={(e) => handleConfigChange('emailNotifications', e?.target?.checked)}
          />

          <Checkbox
            label="SMS Notifications"
            description="Send critical alerts via SMS"
            checked={config?.smsNotifications}
            onChange={(e) => handleConfigChange('smsNotifications', e?.target?.checked)}
          />

          <Checkbox
            label="Automatic Backups"
            description="Enable daily automated system backups"
            checked={config?.autoBackup}
            onChange={(e) => handleConfigChange('autoBackup', e?.target?.checked)}
          />

          <Checkbox
            label="Audit Logging"
            description="Track all user actions and system changes"
            checked={config?.auditLogging}
            onChange={(e) => handleConfigChange('auditLogging', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Session Timeout (minutes)"
            type="number"
            value={config?.sessionTimeout}
            onChange={(e) => handleConfigChange('sessionTimeout', e?.target?.value)}
            placeholder="30"
            min="5"
            max="480"
          />

          <Input
            label="Max Login Attempts"
            type="number"
            value={config?.maxLoginAttempts}
            onChange={(e) => handleConfigChange('maxLoginAttempts', e?.target?.value)}
            placeholder="5"
            min="3"
            max="10"
          />

          <Input
            label="Password Expiry (days)"
            type="number"
            value={config?.passwordExpiry}
            onChange={(e) => handleConfigChange('passwordExpiry', e?.target?.value)}
            placeholder="90"
            min="30"
            max="365"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Database" size={24} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Generate Seed Data</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Create demo orders with basica and sublimado workflows for system testing
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Play"
                  onClick={generateSeedData}
                  loading={isLoading}
                  className="mt-3"
                >
                  Generate Demo Data
                </Button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Download" size={24} className="text-green-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">System Backup</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Download a complete backup of system data and configurations
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  className="mt-3"
                >
                  Download Backup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => window.location?.reload()}
        >
          Reset Changes
        </Button>
        <Button
          onClick={handleSaveConfig}
          loading={isLoading}
          iconName="Save"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default SystemConfigSection;