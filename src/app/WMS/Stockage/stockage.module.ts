import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PortalModule } from '@angular/cdk/portal';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
  import { CommonModule } from '@angular/common';
 import { EditStockageComponent } from './entree/edit-stockage/edit-stockage.component';
 
import { StockageRoutingModule } from './stockage-routing.module';
import { FabricjsEditorModule } from './espace-travail-cartographie/angular-editor-fabric-js/src/public-api';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { LocalsComponent } from './espace-travail-cartographie/locals.component';
 
@NgModule({
 declarations: [
    EditStockageComponent,
    LocalsComponent
    ],
 exports: [



 ],
 imports: [
   CommonModule,
   StockageRoutingModule,
    PerfectScrollbarModule,

   FormsModule, ReactiveFormsModule,
   MatIconModule,
   MatStepperModule,
   MatInputModule,
   MatFormFieldModule,
   MatSelectModule,
   MatDialogModule,
   MatNativeDateModule,
   MatButtonModule,
   FormsModule, ReactiveFormsModule,
   PortalModule,
   NgxBarcodeModule, QRCodeModule,
   ColorPickerModule,
   FabricjsEditorModule,
   MatTabsModule,
   MatRadioModule,
   MatSlideToggleModule,
      
   
  
  ],

 })
 
export class StockageModule { }
