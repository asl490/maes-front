import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  imports: [],
  templateUrl: './analytics.html',
})
export class Analytics {
  metrics = [
    { label: 'Page Views', value: '1.2M', change: '+18.3%', up: true },
    { label: 'Unique Visitors', value: '348K', change: '+9.7%', up: true },
    { label: 'Bounce Rate', value: '42.1%', change: '-2.4%', up: true },
    { label: 'Avg. Session', value: '4m 32s', change: '+0.8%', up: true },
  ];

  sources = [
    { name: 'Organic Search', value: 42, color: 'bg-violet-500', visitors: '146K' },
    { name: 'Direct', value: 28, color: 'bg-sky-500', visitors: '97K' },
    { name: 'Social Media', value: 18, color: 'bg-emerald-500', visitors: '63K' },
    { name: 'Referral', value: 12, color: 'bg-amber-500', visitors: '42K' },
  ];

  topPages = [
    { path: '/app/dashboard', views: '84,521', bounce: '32%', time: '5m 12s', trend: 'up' },
    { path: '/products', views: '62,340', bounce: '45%', time: '3m 48s', trend: 'up' },
    { path: '/pricing', views: '41,200', bounce: '58%', time: '2m 30s', trend: 'down' },
    { path: '/blog/angular-tips', views: '38,900', bounce: '28%', time: '6m 05s', trend: 'up' },
    { path: '/contact', views: '21,450', bounce: '71%', time: '1m 20s', trend: 'down' },
  ];

  weekData = [30, 55, 45, 70, 60, 85, 75];
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
