import { Component, ElementRef, forwardRef, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface FormulaVariable {
  symbol: string;
  label: string;
  source: 'PARAMETER' | 'CONSTANT';
  detail?: string;
}

@Component({
  selector: 'app-formula-input',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FormulaInput), multi: true },
  ],
  template: `<div class="relative">
      <input
        #formulaInput
        class="input w-full font-mono uppercase"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        autocomplete="off"
        spellcheck="false"
        (input)="handleInput($event)"
        (keydown)="handleKeydown($event)"
        (blur)="handleBlur()"
      />
      @if (suggestions().length) {
        <div
          class="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
        >
          @for (item of suggestions(); track item.symbol; let index = $index) {
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-red-50"
              [class.bg-red-50]="index === activeIndex()"
              (mousedown)="$event.preventDefault(); insertVariable(item)"
            >
              <span
                ><code class="text-sm font-black text-slate-800">{{ item.symbol }}</code
                ><span class="ml-2 text-xs text-slate-500">{{ item.label }}</span></span
              ><span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{
                item.source === 'PARAMETER' ? 'Parámetro' : 'Constante'
              }}</span>
            </button>
          }
        </div>
      }
    </div>
    <div class="mt-3 space-y-2">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
          >Variables</span
        >
        @for (item of variables(); track item.symbol) {
          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-xs font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            [title]="item.label + (item.detail ? ' · ' + item.detail : '')"
            (click)="insertVariable(item)"
          >
            {{ item.symbol }}
          </button>
        } @empty {
          <span class="text-xs text-amber-700">No hay variables configuradas.</span>
        }
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
          >Operadores</span
        >
        @for (operator of operators; track operator) {
          <button
            type="button"
            class="flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 font-mono text-xs font-black text-slate-700 hover:bg-slate-200"
            (click)="insertText(operator)"
          >
            {{ operator }}
          </button>
        }
      </div>
    </div>`,
})
export class FormulaInput implements ControlValueAccessor {
  readonly variables = input<FormulaVariable[]>([]);
  readonly placeholder = input('');
  readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('formulaInput');
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly suggestions = signal<FormulaVariable[]>([]);
  readonly activeIndex = signal(0);
  readonly operators = ['+', '-', '*', '/', '(', ')'];
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value.set((value ?? '').toUpperCase());
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.disabled.set(value);
  }
  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursor = input.selectionStart ?? input.value.length;
    const uppercase = input.value.toUpperCase();
    input.value = uppercase;
    input.setSelectionRange(cursor, cursor);
    this.commit(uppercase);
    this.updateSuggestions(cursor);
  }
  handleKeydown(event: KeyboardEvent): void {
    const items = this.suggestions();
    if (!items.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex.set((this.activeIndex() + delta + items.length) % items.length);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      this.insertVariable(items[this.activeIndex()]);
    } else if (event.key === 'Escape') {
      this.suggestions.set([]);
    }
  }
  handleBlur(): void {
    this.onTouched();
    setTimeout(() => this.suggestions.set([]));
  }
  insertVariable(item: FormulaVariable): void {
    const input = this.inputElement()?.nativeElement;
    if (!input) return;
    const start = input.selectionStart ?? this.value().length;
    const end = input.selectionEnd ?? start;
    const range = this.tokenRange(start);
    const before = this.value().slice(0, range.start);
    const after = this.value().slice(Math.max(end, range.end));
    const next = `${before}${item.symbol}${after}`;
    const cursor = before.length + item.symbol.length;
    this.setInput(next, cursor);
    this.suggestions.set([]);
  }
  insertText(text: string): void {
    const input = this.inputElement()?.nativeElement;
    if (!input) return;
    const start = input.selectionStart ?? this.value().length;
    const end = input.selectionEnd ?? start;
    const spaced = ['+', '-', '*', '/'].includes(text) ? ` ${text} ` : text;
    const next = this.value().slice(0, start) + spaced + this.value().slice(end);
    this.setInput(next, start + spaced.length);
  }
  private updateSuggestions(cursor: number): void {
    const token = this.value().slice(this.tokenRange(cursor).start, cursor);
    if (!token) {
      this.suggestions.set([]);
      return;
    }
    const matches = this.variables()
      .filter((item) => item.symbol.includes(token) || item.label.toUpperCase().includes(token))
      .slice(0, 8);
    this.suggestions.set(matches);
    this.activeIndex.set(0);
  }
  private tokenRange(cursor: number): { start: number; end: number } {
    let start = cursor,
      end = cursor;
    while (start > 0 && /[A-Z0-9_]/.test(this.value()[start - 1])) start--;
    while (end < this.value().length && /[A-Z0-9_]/.test(this.value()[end])) end++;
    return { start, end };
  }
  private setInput(value: string, cursor: number): void {
    this.commit(value.toUpperCase());
    queueMicrotask(() => {
      const input = this.inputElement()?.nativeElement;
      input?.focus();
      input?.setSelectionRange(cursor, cursor);
    });
  }
  private commit(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }
}
