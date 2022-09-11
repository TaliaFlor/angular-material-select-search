import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';

const EMPTY_OPTION = '— None —';
const SELECT_ALL = '— Select All —';

export interface SelectSearchConfig {
  multiple?: boolean; // whether multiple options can be selected or not
  search?: boolean; // whether to enable the search
  optional?: boolean; // whether the attribute is optional or not, when serving as a filter for something
  style?: string; // additional css styling
  appearance?: MatFormFieldAppearance; // changes the form field style
}

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
})
export class SelectSearchComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  // =================================================== ATTRIBUTES ====================================================

  // ------------------------------------------------------

  @Input() label: string; // the label of the select
  @Input() selected: any; // the options selected (type string[] | string)
  @Input() options: string[]; // all the options available
  @Input() disabled?: boolean; // whether to disable the component
  @Input() config?: SelectSearchConfig; // additional configuration

  @Output() selectedChange = new EventEmitter<string[]>(); // updates the selected values array
  @Output() filter = new EventEmitter<void>(); // fires when the selection changes

  // ------------------------------------------------------

  searchValue: string;
  private minOptionsQty: number;

  allSelected = false;

  readonly selectAll = SELECT_ALL;

  private initialized = false;

  // ------------------------------------------------------

  private readonly selection = new Subject<void>();
  private readonly subscriptions: Subscription[] = [];

  // ------------------------------------------------------

  @ViewChild('search') matSearch;
  @ViewChild('allCheckbok') allCheckbok: MatCheckbox;

  @ViewChild(MatSelect, { static: true }) select: MatSelect;

  // ------------------------------------------------------

  // ===================================================================================================================

  // ====================================================== INIT =======================================================

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    const subscription = this.selection
      .pipe(debounceTime(750)) // Awaits for 750ms before emitting latest value
      .subscribe(_ => this.emitSelected());

    this.subscriptions.push(subscription);
  }

  private emitSelected(): void {
    this.allSelected = this.selected?.length === this.options?.length;

    if (this.optional) {
      if (this.multiple) {
        const index = this.selected.findIndex(item => item === EMPTY_OPTION);
        this.selected[index] = null;
      } else if (this.selected === EMPTY_OPTION) {
        this.selected = [null];
      }
    }

    this.selectedChange.emit(this.selected);
    this.filter.emit();
  }

  ngAfterViewChecked(): void {
    if (!this.initialized && this.label && this.options) {
      this.initialized = true;
      this.minOptionsQty = this.optional ? 1 : 2;

      if (!this.config) this.config = { appearance: 'standard' };

      if (this.optional && this.options.length > 0) this.options.unshift(EMPTY_OPTION);
    }

    this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {
    const subscription = this.select.openedChange.subscribe(open => {
      if (!open) {
        this.onClearSearch();
      } else if (!this.selected && this.allCheckbok) {
        this.allCheckbok.checked = false;
        this.allCheckbok._elementRef.nativeElement.style = 'color: black';
      }
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  // ===================================================================================================================

  // ===================================================== EVENTS ======================================================

  // ------------------------------------------------------

  onSelect(): void {
    this.selection.next();
  }

  onSelectAll(): void {
    this.allSelected = !this.allSelected;

    const action = this.allSelected ? item => item.select() : item => item.deselect();
    this.select?.options?.filter(item => !item.disabled).forEach(action);
  }

  // ------------------------------------------------------

  onSearch(event: EventTarget): void {
    this.searchValue = (event as HTMLInputElement).value?.toLowerCase();
  }

  onClearSearch(): void {
    this.searchValue = '';
    if (this.config?.search) this.matSearch.nativeElement.value = '';
  }

  // ------------------------------------------------------

  // ===================================================================================================================

  // ======================================================= UI ========================================================

  // ------------------------------------------------------

  get disable(): boolean {
    return this.disabled || this.options?.length < this.minOptionsQty;
  }

  // ------------------------------------------------------

  get fistPartOfLabel(): string {
    if (!this.selected) return '';

    const selected = this.multiple ? this.selected[0] : this.selected;
    return !selected ? EMPTY_OPTION : selected?.toString();
  }

  get secondPartOfLabel(): string {
    if (!this.multiple || this.selected?.length <= 1) return '';

    const remainingQty = this.selected?.length - 1;
    const qualifier = this.selected?.length > 2 ? 'others' : 'other';

    return `(+${remainingQty} ${qualifier})`; // (+1 other) or (+3 others)
  }

  // ------------------------------------------------------

  get showSearch(): boolean {
    return this.search && this.options?.length > 1;
  }

  // ------------------------------------------------------

  get showClearSelect(): boolean {
    return !this.multiple && !this.searchValue;
  }

  // ------------------------------------------------------

  get showAllSelected(): boolean {
    const hidden = this.select?.options?.filter(item => item.disabled)?.length;
    const options = this.options?.length;

    return this.multiple && hidden < options - 1; // Show only in multiple mode when there is at least two visible options
  }

  get allSelectedStyle(): string {
    return this.allSelected || this.someSelected ? 'has-selection' : ''; // Pay attention to the configuration of the mixin to make this work properly
  }

  get someSelected(): boolean {
    return !this.allSelected && this.selected && this.selected?.length > 0;
  }

  // ------------------------------------------------------

  hide(option: string): boolean {
    if (!this.search || !this.searchValue || this.searchValue?.trim() === '') return false;

    return option === EMPTY_OPTION || !option.toLowerCase().includes(this.searchValue);
  }

  // ------------------------------------------------------

  // ===================================================================================================================

  // ==================================================== GETTERS ======================================================

  get multiple(): boolean {
    return this.config?.multiple;
  }

  get search(): boolean {
    return this.config?.search;
  }

  get optional(): boolean {
    return this.config?.optional;
  }

  get style(): string {
    return this.config?.style;
  }

  get appearance(): MatFormFieldAppearance {
    return this.config?.appearance;
  }

  // ===================================================================================================================
}
