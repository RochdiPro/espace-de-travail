import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuWmsComponent } from './menu-wms/menu-wms.component';
import { EditStockageComponent } from './Stockage/entree/edit-stockage/edit-stockage.component';
   
const routes: Routes =

  [
    {path: '', component: MenuWmsComponent},
    {path: 'WMS-Stockage', component: EditStockageComponent,loadChildren:()=>import('./Stockage/stockage.module').then(m=>m.StockageModule)},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
