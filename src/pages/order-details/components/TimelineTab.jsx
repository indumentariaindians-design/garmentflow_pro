import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineTab = ({ timeline, onAddNote }) => {
  const getEventIcon = (type) => {
    const icons = {
      'status_change': 'ArrowRight',
      'stage_complete': 'CheckCircle',
      'note_added': 'MessageSquare',
      'file_uploaded': 'Upload',
      'quality_check': 'Shield',
      'rejection': 'XCircle',
      'hold': 'Pause'
    };
    return icons?.[type] || 'Circle';
  };

  const getEventColor = (type) => {
    const colors = {
      'status_change': 'text-blue-600 bg-blue-100',
      'stage_complete': 'text-green-600 bg-green-100',
      'note_added': 'text-purple-600 bg-purple-100',
      'file_uploaded': 'text-indigo-600 bg-indigo-100',
      'quality_check': 'text-orange-600 bg-orange-100',
      'rejection': 'text-red-600 bg-red-100',
      'hold': 'text-yellow-600 bg-yellow-100'
    };
    return colors?.[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
        <Button variant="outline" iconName="Plus" iconPosition="left" size="sm" onClick={onAddNote}>
          Add Note
        </Button>
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {timeline?.map((event, index) => (
            <div key={event?.id} className="relative flex gap-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getEventColor(event?.type)}`}>
                <Icon name={getEventIcon(event?.type)} size={20} />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{event?.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event?.description}</p>
                    </div>
                    <time className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {event?.timestamp}
                    </time>
                  </div>

                  {event?.user && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-600">{event?.user}</span>
                      {event?.station && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{event?.station}</span>
                        </>
                      )}
                    </div>
                  )}

                  {event?.attachments && event?.attachments?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {event?.attachments?.map((attachment, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                            <Icon name="Paperclip" size={12} className="text-gray-500" />
                            <span className="text-xs text-gray-700">{attachment?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event?.metrics && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(event?.metrics)?.map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500 capitalize">{key?.replace('_', ' ')}: </span>
                            <span className="font-medium text-gray-900">{value}</span>
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
      </div>
    </div>
  );
};

export default TimelineTab;