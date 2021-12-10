import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
   const routes: Routes =

  [
       { path: 'Locals',loadChildren:()=>import('./espace-travail-cartographie/espace-travail.module').then(m=>m.EspaceTravailModule)},
     
   
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockageRoutingModule { }
