import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AgmCoreModule} from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatPaginator, MatPaginatorModule,MatSortModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { DiagrammComponent } from './components/diagramm/diagramm.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { TableComponent } from './components/table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../app/services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HeatmapComponent,
    DiagrammComponent,
    ImpressumComponent,
    TableComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatSortModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyDLapBJb8kU0--uDm5YFGMFbVEt_VqaoL8'
    }),

  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
