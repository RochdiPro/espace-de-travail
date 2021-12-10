import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
 import { EspaceTravailCartographieComponent } from '../espace-travail-cartographie/espace-travail-cartographie.component';
import { LocalsComponent } from './locals.component';
const routes: Routes =

  [
    {path: '', component: LocalsComponent},

    { path: 'Espace-Travail/:id', component: EspaceTravailCartographieComponent},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspaceTravailRoutingModule { }
