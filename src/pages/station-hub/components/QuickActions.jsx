import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const QuickActions = ({ onAction }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const actionOptions = [
    { value: 'rebalance', label: 'Rebalance Workload' },
    { value: 'priority', label: 'Adjust Priority' },
    { value: 'maintenance', label: 'Schedule Maintenance' },
    { value: 'worker', label: 'Reassign Worker' }
  ];

  const stationOptions = [
    { value: 'design', label: 'Design Station' },
    { value: 'printing', label: 'Impresión Station' },
    { value: 'pressing', label: 'Planchado Station' },
    { value: 'cutting', label: 'Corte Station' },
    { value: 'stamping', label: 'Estampado Station' },
    { value: 'sewing', label: 'Confección Station' },
    { value: 'qc', label: 'QC Station' },
    { value: 'packaging', label: 'Empaquetado Station' }
  ];

  const handleExecuteAction = () => {
    if (selectedAction && selectedStation) {
      onAction(selectedAction, selectedStation);
      setSelectedAction('');
      setSelectedStation('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Supervisor interventions and adjustments</p>
        </div>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Action Type"
          placeholder="Select action..."
          options={actionOptions}
          value={selectedAction}
          onChange={setSelectedAction}
        />
        
        <Select
          label="Target Station"
          placeholder="Select station..."
          options={stationOptions}
          value={selectedStation}
          onChange={setSelectedStation}
        />

        <div className="flex items-end">
          <Button
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
            disabled={!selectedAction || !selectedStation}
            onClick={handleExecuteAction}
          >
            Execute
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => onAction('refresh', 'all')}
        >
          Refresh All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Pause"
          iconPosition="left"
          onClick={() => onAction('pause', 'all')}
        >
          Pause All
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="BarChart3"
          iconPosition="left"
          onClick={() => onAction('report', 'all')}
        >
          Generate Report
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          iconPosition="left"
          onClick={() => onAction('settings', 'all')}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;