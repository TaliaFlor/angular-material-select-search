import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectSearchComponent } from './select-search/select-search.component';

@NgModule({
  imports: [BrowserModule, MaterialModule, BrowserAnimationsModule],
  declarations: [AppComponent, SelectSearchComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
