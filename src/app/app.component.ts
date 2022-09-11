import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectSearchConfig } from './select-search/select-search.component';
import { filter } from './utils';

// ----------------------------------------------------------------

interface Client {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  isMillionarie?: boolean;
}

const DATA: Client[] = [
  {
    id: 1,
    name: 'Delainey Claxson',
    phone: '+86 (500) 574-6342',
    email: null,
    isMillionarie: null,
  },
  {
    id: 2,
    name: 'Adam Raxworthy',
    phone: null,
    email: 'araxworthy1@cnet.com',
    isMillionarie: null,
  },
  {
    id: 3,
    name: 'Malena Goatcher',
    phone: '+7 (317) 793-2718',
    email: null,
    isMillionarie: null,
  },
  {
    id: 4,
    name: 'Rossy Langmuir',
    phone: '+48 (859) 436-2113',
    email: 'rlangmuir3@oaic.gov.au',
    isMillionarie: null,
  },
  {
    id: 5,
    name: 'Marj Kopfen',
    phone: '+63 (767) 570-9845',
    email: 'mkopfen4@surveymonkey.com',
    isMillionarie: null,
  },
  {
    id: 6,
    name: 'Maribel Tremblot',
    phone: '+62 (248) 476-5305',
    email: 'mtremblot5@sina.com.cn',
    isMillionarie: null,
  },
  {
    id: 7,
    name: 'Del Restieaux',
    phone: '+62 (903) 781-8724',
    email: null,
    isMillionarie: null,
  },
  {
    id: 8,
    name: 'Kelli Crowcum',
    phone: null,
    email: 'kcrowcum7@ameblo.jp',
    isMillionarie: null,
  },
  {
    id: 9,
    name: 'Reeta Jakaway',
    phone: null,
    email: null,
    isMillionarie: null,
  },
  {
    id: 10,
    name: 'Marje Cragoe',
    phone: '+995 (558) 776-1369',
    email: null,
    isMillionarie: null,
  },
];

// ----------------------------------------------------------------

interface ClientFilters {
  names?: string[];
  phones?: string[];
  emails?: string[];
  isMillionaries?: string[];
}

// ----------------------------------------------------------------

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // ----------------------------------------------------------------

  readonly options: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  // -----------------------

  singleSelect_Selecteds: string[] = [];
  readonly singleSelect_Config: SelectSearchConfig = { search: true, appearance: 'fill', style: 'width: 300px;' };

  // -----------------------

  multipleSelect_Selecteds: string[] = [];
  readonly multipleSelect_Config: SelectSearchConfig = { search: true, multiple: true, appearance: 'fill', style: 'width: 300px;' };

  // ----------------------------------------------------------------

  readonly baseConfig: SelectSearchConfig = this.getFilterConfig();
  readonly optionalConfig: SelectSearchConfig = this.composeFilterConfig(this.baseConfig, { optional: true });

  readonly displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'isMillionarie'];
  readonly dataSource: MatTableDataSource<Client> = new MatTableDataSource<Client>(DATA);

  readonly filtersSelected: ClientFilters = {
    names: [],
    phones: [],
    emails: [],
    isMillionaries: [],
  };
  readonly filtersOptions: ClientFilters = {
    names: [],
    phones: [],
    emails: [],
    isMillionaries: [],
  };

  private readonly filtersAttributes = [
    { filterAttr: 'names', attr: 'name' },
    { filterAttr: 'phones', attr: 'phone' },
    { filterAttr: 'emails', attr: 'email' },
    { filterAttr: 'isMillionaries', attr: 'isMillionarie' },
  ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // ----------------------------------------------------------------

  constructor() {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;

    for (const item of DATA) {
      if (item.name) this.filtersOptions.names?.push(item.name);
      if (item.phone) this.filtersOptions.phones?.push(item.phone);
      if (item.email) this.filtersOptions.emails?.push(item.email);
      if (item.isMillionarie) this.filtersOptions.isMillionaries?.push(String(item.isMillionarie));
    }

    this.filtersOptions.names?.sort();
    this.filtersOptions.phones?.sort();
    this.filtersOptions.emails?.sort();
    this.filtersOptions.isMillionaries?.sort();
  }

  // ----------------------------------------------------------------

  onSingleSelectFilter(): void {
    console.log(this.singleSelect_Selecteds);
  }

  onMultipleSelectFilter(): void {
    console.log(this.multipleSelect_Selecteds);
  }

  // ------------------------------

  onFilter(): void {
    this.dataSource.data = filter(DATA, this.filtersSelected, this.filtersAttributes);
  }

  // ----------------------------------------------------------------

  composeFilterConfig(base: SelectSearchConfig, config?: SelectSearchConfig): SelectSearchConfig {
    const composed = Object.assign({}, base, config);
    return this.getFilterConfig(composed);
  }

  getFilterConfig(config?: SelectSearchConfig): SelectSearchConfig {
    return {
      multiple: this.getConfig(config?.multiple, true),
      search: this.getConfig(config?.search, true),
      optional: this.getConfig(config?.optional, false),
      style: this.getConfig(config?.style, ''),
      appearance: this.getConfig(config?.appearance, 'standard'),
    };
  }

  private getConfig(attribute: any, defaultValue: any): any {
    return attribute != null || attribute !== undefined ? attribute : defaultValue;
  }

  // ----------------------------------------------------------------
}
