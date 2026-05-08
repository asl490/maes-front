import { Component, inject } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ThemeService } from '../../services/theme.service';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, DataZoomComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-charts',
  imports: [NgxEchartsDirective],
  templateUrl: './charts.html',
})
export class Charts {
  private theme = inject(ThemeService);

  get isDark() { return this.theme.isDark(); }

  get colors() {
    return ['#9D2449', '#D9C19C', '#c9a87a', '#621132', '#f87171', '#4ade80'];
  }

  get axisColor() { return this.isDark ? '#525252' : '#d4d4d4'; }
  get labelColor() { return this.isDark ? '#a3a3a3' : '#666666'; }
  get bgColor()   { return this.isDark ? '#161616' : '#ffffff'; }
  get splitLine() { return this.isDark ? '#2e2e2e' : '#f0f0f0'; }

  // Bar chart
  get barOption(): EChartsOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: this.bgColor, borderColor: this.axisColor, textStyle: { color: this.labelColor } },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        axisLine: { lineStyle: { color: this.axisColor } },
        axisLabel: { color: this.labelColor, fontSize: 11 },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: this.labelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: this.splitLine } },
      },
      series: [{
        type: 'bar',
        data: [42, 68, 55, 82, 63, 91, 74, 88, 57, 76, 95, 70],
        itemStyle: { color: '#9D2449', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#D9C19C' } },
      }],
    };
  }

  // Line chart
  get lineOption(): EChartsOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: this.bgColor, borderColor: this.axisColor, textStyle: { color: this.labelColor } },
      legend: { data: ['Revenue', 'Expenses'], textStyle: { color: this.labelColor }, top: 0 },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        axisLine: { lineStyle: { color: this.axisColor } },
        axisLabel: { color: this.labelColor, fontSize: 11 },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: this.labelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: this.splitLine } },
      },
      series: [
        {
          name: 'Revenue',
          type: 'line',
          smooth: true,
          data: [42, 68, 55, 82, 63, 91, 74, 88, 57, 76, 95, 70],
          lineStyle: { color: '#9D2449', width: 2.5 },
          itemStyle: { color: '#9D2449' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(157,36,73,0.25)' },
            { offset: 1, color: 'rgba(157,36,73,0)' },
          ])},
        },
        {
          name: 'Expenses',
          type: 'line',
          smooth: true,
          data: [28, 45, 38, 60, 42, 65, 50, 62, 40, 55, 70, 48],
          lineStyle: { color: '#D9C19C', width: 2.5 },
          itemStyle: { color: '#D9C19C' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(217,193,156,0.2)' },
            { offset: 1, color: 'rgba(217,193,156,0)' },
          ])},
        },
      ],
    };
  }

  // Pie chart
  get pieOption(): EChartsOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', backgroundColor: this.bgColor, borderColor: this.axisColor, textStyle: { color: this.labelColor } },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: this.labelColor } },
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: this.bgColor, borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: this.labelColor } },
        data: [
          { value: 42, name: 'Organic',  itemStyle: { color: '#9D2449' } },
          { value: 28, name: 'Direct',   itemStyle: { color: '#D9C19C' } },
          { value: 18, name: 'Social',   itemStyle: { color: '#c9a87a' } },
          { value: 12, name: 'Referral', itemStyle: { color: '#621132' } },
        ],
      }],
    };
  }

  // Stacked bar
  get stackedOption(): EChartsOption {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: this.bgColor, borderColor: this.axisColor, textStyle: { color: this.labelColor } },
      legend: { data: ['Q1','Q2','Q3','Q4'], textStyle: { color: this.labelColor }, top: 0 },
      grid: { left: 40, right: 20, top: 40, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['Product A','Product B','Product C','Product D','Product E'],
        axisLine: { lineStyle: { color: this.axisColor } },
        axisLabel: { color: this.labelColor, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { color: this.labelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: this.splitLine } },
      },
      series: [
        { name: 'Q1', type: 'bar', stack: 'total', data: [20,30,25,35,28], itemStyle: { color: '#9D2449' } },
        { name: 'Q2', type: 'bar', stack: 'total', data: [15,25,20,30,22], itemStyle: { color: '#c9a87a' } },
        { name: 'Q3', type: 'bar', stack: 'total', data: [18,28,22,32,25], itemStyle: { color: '#D9C19C' } },
        { name: 'Q4', type: 'bar', stack: 'total', data: [22,32,27,38,30], itemStyle: { color: '#621132' } },
      ],
    };
  }
}
