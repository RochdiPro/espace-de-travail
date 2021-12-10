import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 import { MenuComponent } from './menu/menu.component';
     
 

const routes: Routes =
  [
    { path: '', redirectTo: 'Menu', pathMatch: 'full' },

    {
      path: 'Menu', component: MenuComponent, children: [
             //       wms routing 
        { path: 'WMS' ,loadChildren:()=>import('./WMS/wms.module').then(m=>m.WmsModule)},
 
      ]
    }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
