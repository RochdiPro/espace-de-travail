 import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
   import { WmsRoutingModule } from './wms-routing.module';
 import { CommonModule } from '@angular/common';
import { MenuWmsComponent } from './menu-wms/menu-wms.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
     
@NgModule({
  declarations: [  
    MenuWmsComponent,
 
   ],
  exports: [



  ],
  imports: [
     CommonModule,
     PerfectScrollbarModule,
    WmsRoutingModule,
   ],
   schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  
  })
export class WmsModule { }
