import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AboutComponent } from './components/about/about.component';
import {DiagrammComponent} from './components/diagramm/diagramm.component';
import {HeatmapComponent} from './components/heatmap/heatmap.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {TableComponent} from './components/table/table.component';
const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'diagramm',
    component: DiagrammComponent
  },
  {
    path: '',
    component: HeatmapComponent
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  },
  {
    path: 'table',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
