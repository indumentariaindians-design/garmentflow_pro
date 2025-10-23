import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductionStages = ({ stages, currentStage }) => {
  const getStageIcon = (stageName) => {
    const icons = {
      'Design': 'Palette',
      'Impresión': 'Printer',
      'Planchado': 'Zap',
      'Corte': 'Scissors',
      'Estampado': 'Stamp',
      'Confección': 'Shirt',
      'QC': 'CheckCircle',
      'Empaquetado': 'Package'
    };
    return icons?.[stageName] || 'Circle';
  };

  const getStageStatus = (stage, index) => {
    if (stage?.status === 'completed') return 'completed';
    if (stage?.status === 'in-progress') return 'current';
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'current';
    return 'pending';
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'bg-green-500 text-white',
          line: 'bg-green-500'
        };
      case 'current':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'bg-blue-500 text-white',
          line: 'bg-gray-300'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'bg-gray-300 text-gray-600',
          line: 'bg-gray-300'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Production Timeline</h2>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-300 hidden lg:block">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentStage / (stages?.length - 1)) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {stages?.map((stage, index) => {
            const status = getStageStatus(stage, index);
            const styles = getStatusStyles(status);
            
            return (
              <div key={stage?.id} className="relative">
                <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${styles?.container}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${styles?.icon}`}>
                      <Icon name={getStageIcon(stage?.name)} size={20} />
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{stage?.name}</h3>
                    
                    {stage?.assignedWorker && (
                      <p className="text-xs text-gray-600 mb-2">{stage?.assignedWorker}</p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs">
                      {status === 'completed' && (
                        <>
                          <Icon name="CheckCircle" size={12} className="text-green-600" />
                          <span className="text-green-600">Complete</span>
                        </>
                      )}
                      {status === 'current' && (
                        <>
                          <Icon name="Clock" size={12} className="text-blue-600" />
                          <span className="text-blue-600">In Progress</span>
                        </>
                      )}
                      {status === 'pending' && (
                        <>
                          <Icon name="Circle" size={12} className="text-gray-400" />
                          <span className="text-gray-500">Pending</span>
                        </>
                      )}
                    </div>
                    
                    {stage?.completedAt && (
                      <p className="text-xs text-gray-500 mt-1">{stage?.completedAt}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductionStages;