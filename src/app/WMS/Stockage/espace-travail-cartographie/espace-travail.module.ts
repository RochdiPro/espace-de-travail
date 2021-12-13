 import { NgModule } from '@angular/core';
 import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
 import { MatInputModule } from '@angular/material/input';
 import { PortalModule } from '@angular/cdk/portal';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
  import { ColorPickerModule } from 'ngx-color-picker';
  import { CommonModule } from '@angular/common';
import { FabricjsEditorModule } from './angular-editor-fabric-js/src/public-api';
 import { ScrollbarModule } from './angular-editor-fabric-js/src/lib/scrollbar/scrollbar.module';
import {   CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EspaceTravailRoutingModule } from './espace-travail-routing.module';
import { EspaceTravailCartographieComponent } from './espace-travail-cartographie.component';
 import { ArrowEspaceTravailDialogComponent, DialogueEspacaTravailComponent, ImageEspaceTravailDialogComponent, LineEspaceTravailDialogComponent } from './dialogue-espace-travail/dialogue-espace-travail.component.component';
import { MatRadioModule } from '@angular/material/radio';
 
@NgModule({
  declarations: [
     
     //stockage
     
 EspaceTravailCartographieComponent,
 DialogueEspacaTravailComponent,
 ImageEspaceTravailDialogComponent,
  ArrowEspaceTravailDialogComponent,
 LineEspaceTravailDialogComponent,
   ],
  exports: [

    MatInputModule,

  ],
  imports: [
    ScrollbarModule,
      CommonModule,
      EspaceTravailRoutingModule,
     PerfectScrollbarModule,
     FormsModule, ReactiveFormsModule,
    MatIconModule,
     MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule, ReactiveFormsModule,
    PortalModule,
     ColorPickerModule,
    FabricjsEditorModule,
     
    MatRadioModule,
     
   ],
  providers: [],
  schemas: [
  CUSTOM_ELEMENTS_SCHEMA
],

 })
export class EspaceTravailModule { }
