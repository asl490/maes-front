import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  stats = [
    { label: 'Total Revenue',   value: '$84,254', change: '+12.5%', up: true,  icon: 'revenue'    },
    { label: 'Active Users',    value: '24,521',  change: '+8.2%',  up: true,  icon: 'users'      },
    { label: 'New Orders',      value: '1,893',   change: '-3.1%',  up: false, icon: 'orders'     },
    { label: 'Conversion Rate', value: '3.24%',   change: '+1.8%',  up: true,  icon: 'conversion' },
  ];

  transactions = [
    { id: '#TXN-001', customer: 'Alice Johnson', email: 'alice@example.com', amount: '$1,240.00', status: 'success', date: 'Jan 28, 2025' },
    { id: '#TXN-002', customer: 'Bob Martinez',  email: 'bob@example.com',   amount: '$890.50',   status: 'pending', date: 'Jan 28, 2025' },
    { id: '#TXN-003', customer: 'Carol White',   email: 'carol@example.com', amount: '$3,100.00', status: 'success', date: 'Jan 27, 2025' },
    { id: '#TXN-004', customer: 'David Lee',     email: 'david@example.com', amount: '$450.00',   status: 'failed',  date: 'Jan 27, 2025' },
    { id: '#TXN-005', customer: 'Eva Brown',     email: 'eva@example.com',   amount: '$2,780.00', status: 'success', date: 'Jan 26, 2025' },
    { id: '#TXN-006', customer: 'Frank Wilson',  email: 'frank@example.com', amount: '$620.00',   status: 'pending', date: 'Jan 26, 2025' },
  ];

  activity = [
    { user: 'Sarah Connor', action: 'created a new project',     time: '2 min ago',  avatar: 'SC' },
    { user: 'Mike Ross',    action: 'updated billing info',       time: '15 min ago', avatar: 'MR' },
    { user: 'Anna Bell',    action: 'submitted a support ticket', time: '1h ago',     avatar: 'AB' },
    { user: 'Tom Hardy',    action: 'upgraded to Pro plan',       time: '3h ago',     avatar: 'TH' },
    { user: 'Lisa Park',    action: 'exported analytics report',  time: '5h ago',     avatar: 'LP' },
  ];

  barHeights = [40, 65, 50, 80, 60, 90, 70, 85, 55, 75, 95, 68];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
