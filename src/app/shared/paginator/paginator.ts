import { Component, input, output, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-paginator',
  imports: [LucideAngularModule],
  templateUrl: './paginator.html',
})
export class Paginator {
  page      = input.required<number>();
  pageSize  = input<number>(10);
  total     = input.required<number>();
  pageSizes = input<number[]>([5, 10, 25, 50]);

  pageChange     = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  from = computed(() => this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1);
  to   = computed(() => Math.min(this.page() * this.pageSize(), this.total()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end   = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
  });

  goTo(p: number | '...') {
    if (p === '...' || p === this.page()) return;
    if (p < 1 || p > this.totalPages()) return;
    this.pageChange.emit(p);
  }

  prev() { if (this.page() > 1) this.pageChange.emit(this.page() - 1); }
  next() { if (this.page() < this.totalPages()) this.pageChange.emit(this.page() + 1); }

  onPageSizeChange(e: Event) {
    this.pageSizeChange.emit(Number((e.target as HTMLSelectElement).value));
    this.pageChange.emit(1);
  }
}
