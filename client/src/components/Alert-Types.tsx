import React from 'react';

interface AlertItem {
  alert_type: string;
  location: string;
}

interface AlertTypesProps {
  items: AlertItem[];
}

const AlertTypes: React.FC<AlertTypesProps> = ({ items }) => {
  
  if (!items || items.length === 0) {
    return <div>No alerts found</div>;
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.alert_type}>
          {item.location}
        </div>
      ))}
    </div>
  );
};

export default AlertTypes;
