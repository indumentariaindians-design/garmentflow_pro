import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HistoryTab = ({ history }) => {
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const getActionIcon = (action) => {
    const icons = {
      'created': 'Plus',
      'updated': 'Edit',
      'status_changed': 'ArrowRight',
      'stage_advanced': 'ChevronRight',
      'stage_rejected': 'XCircle',
      'stage_held': 'Pause',
      'file_uploaded': 'Upload',
      'note_added': 'MessageSquare',
      'quantity_adjusted': 'RotateCcw',
      'assigned': 'UserPlus',
      'unassigned': 'UserMinus',
      'priority_changed': 'AlertTriangle',
      'due_date_changed': 'Calendar'
    };
    return icons?.[action] || 'Circle';
  };

  const getActionColor = (action) => {
    const colors = {
      'created': 'text-green-600 bg-green-100',
      'updated': 'text-blue-600 bg-blue-100',
      'status_changed': 'text-purple-600 bg-purple-100',
      'stage_advanced': 'text-green-600 bg-green-100',
      'stage_rejected': 'text-red-600 bg-red-100',
      'stage_held': 'text-yellow-600 bg-yellow-100',
      'file_uploaded': 'text-indigo-600 bg-indigo-100',
      'note_added': 'text-gray-600 bg-gray-100',
      'quantity_adjusted': 'text-orange-600 bg-orange-100',
      'assigned': 'text-blue-600 bg-blue-100',
      'unassigned': 'text-gray-600 bg-gray-100',
      'priority_changed': 'text-red-600 bg-red-100',
      'due_date_changed': 'text-purple-600 bg-purple-100'
    };
    return colors?.[action] || 'text-gray-600 bg-gray-100';
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'status_changes', label: 'Status Changes' },
    { value: 'stage_activities', label: 'Stage Activities' },
    { value: 'file_activities', label: 'File Activities' },
    { value: 'assignments', label: 'Assignments' },
    { value: 'updates', label: 'Updates' }
  ];

  const filteredHistory = history?.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'status_changes') return ['status_changed', 'priority_changed']?.includes(item?.action);
    if (filter === 'stage_activities') return ['stage_advanced', 'stage_rejected', 'stage_held']?.includes(item?.action);
    if (filter === 'file_activities') return ['file_uploaded']?.includes(item?.action);
    if (filter === 'assignments') return ['assigned', 'unassigned']?.includes(item?.action);
    if (filter === 'updates') return ['updated', 'quantity_adjusted', 'due_date_changed']?.includes(item?.action);
    return true;
  })?.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            size="sm"
            iconName={sortOrder === 'desc' ? 'ArrowDown' : 'ArrowUp'}
            iconPosition="left"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </Button>
        </div>
      </div>
      {filteredHistory?.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory?.map((item, index) => (
            <div key={item?.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-4">
                {/* Action Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(item?.action)}`}>
                  <Icon name={getActionIcon(item?.action)} size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item?.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{item?.description}</p>
                    </div>
                    <time className="text-xs text-gray-500 whitespace-nowrap">
                      {item?.timestamp}
                    </time>
                  </div>

                  {/* User and Context */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                    {item?.user && (
                      <div className="flex items-center gap-1">
                        <Icon name="User" size={12} />
                        <span>{item?.user}</span>
                      </div>
                    )}
                    {item?.station && (
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        <span>{item?.station}</span>
                      </div>
                    )}
                    {item?.ipAddress && (
                      <div className="flex items-center gap-1">
                        <Icon name="Globe" size={12} />
                        <span>{item?.ipAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Changes */}
                  {item?.changes && Object.keys(item?.changes)?.length > 0 && (
                    <div className="bg-gray-50 rounded p-3 mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Changes Made:</p>
                      <div className="space-y-1">
                        {Object.entries(item?.changes)?.map(([field, change]) => (
                          <div key={field} className="text-xs">
                            <span className="font-medium text-gray-700 capitalize">
                              {field?.replace('_', ' ')}:
                            </span>
                            {change?.from && (
                              <span className="text-red-600 line-through ml-2">{change?.from}</span>
                            )}
                            <span className="text-green-600 ml-2">{change?.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Data */}
                  {item?.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        {Object.entries(item?.metadata)?.map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500 capitalize">{key?.replace('_', ' ')}: </span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files or Attachments */}
                  {item?.attachments && item?.attachments?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {item?.attachments?.map((attachment, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                            <Icon name="Paperclip" size={10} className="text-gray-500" />
                            <span className="text-xs text-gray-700">{attachment?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="History" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No history found</p>
          <p className="text-sm text-gray-600">
            {filter === 'all' ?'No activities have been recorded for this order yet'
              : `No ${filterOptions?.find(opt => opt?.value === filter)?.label?.toLowerCase()} found`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;