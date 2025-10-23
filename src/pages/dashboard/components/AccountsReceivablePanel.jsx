import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountsReceivablePanel = () => {
  const receivablesData = [
    {
      id: 1,
      customerName: "Fashion Forward LLC",
      invoiceNumber: "INV-2024-0089",
      amount: 15750.00,
      dueDate: new Date('2024-10-25'),
      agingDays: 3,
      status: 'current'
    },
    {
      id: 2,
      customerName: "Urban Style Co.",
      invoiceNumber: "INV-2024-0087",
      amount: 8920.50,
      dueDate: new Date('2024-10-20'),
      agingDays: 8,
      status: 'overdue'
    },
    {
      id: 3,
      customerName: "Trendy Threads Inc.",
      invoiceNumber: "INV-2024-0085",
      amount: 22100.75,
      dueDate: new Date('2024-10-15'),
      agingDays: 13,
      status: 'overdue'
    },
    {
      id: 4,
      customerName: "Boutique Collective",
      invoiceNumber: "INV-2024-0083",
      amount: 6750.25,
      dueDate: new Date('2024-10-28'),
      agingDays: -1,
      status: 'current'
    }
  ];

  const totalOutstanding = receivablesData?.reduce((sum, item) => sum + item?.amount, 0);
  const overdueAmount = receivablesData?.filter(item => item?.status === 'overdue')?.reduce((sum, item) => sum + item?.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'text-green-600 bg-green-50';
      case 'overdue':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAgingColor = (days) => {
    if (days <= 0) return 'text-green-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <Icon name="DollarSign" size={24} className="text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Accounts Receivable</h2>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Outstanding</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalOutstanding)}</p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-900">{formatCurrency(overdueAmount)}</p>
            </div>
            <Icon name="AlertCircle" size={24} className="text-red-600" />
          </div>
        </div>
      </div>
      {/* Receivables List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Outstanding Invoices</h3>
        
        {receivablesData?.map((item) => (
          <div key={item?.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-150">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-sm font-medium text-gray-900">{item?.customerName}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                  {item?.status === 'current' ? 'Current' : 'Overdue'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Icon name="FileText" size={12} />
                  <span>{item?.invoiceNumber}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span>Due: {formatDate(item?.dueDate)}</span>
                </span>
                <span className={`flex items-center space-x-1 ${getAgingColor(item?.agingDays)}`}>
                  <Icon name="Clock" size={12} />
                  <span>
                    {item?.agingDays <= 0 
                      ? `${Math.abs(item?.agingDays)} days remaining`
                      : `${item?.agingDays} days overdue`
                    }
                  </span>
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(item?.amount)}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-150">
            <Icon name="Eye" size={16} />
            <span>View All Invoices</span>
          </button>
          
          <button className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors duration-150">
            <Icon name="Download" size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountsReceivablePanel;