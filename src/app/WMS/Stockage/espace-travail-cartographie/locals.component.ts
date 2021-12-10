 import { Component,  OnInit} from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
 import { Router } from '@angular/router';
   
import { StockageService } from '../services/stockage.service';
 import {trigger,state,style,transition,animate,} from '@angular/animations';
 
@Component({
  selector: 'app-locals',
  templateUrl: './locals.component.html',
  styleUrls: ['./locals.component.scss'],
 
})

export class LocalsComponent implements OnInit {
   
 
  //declaration formGroup
  localFormGroup: FormGroup;
 
  //Declaration du tableaux de (locals/halls/rayons/etages/emplacement)
  locals: any = [];
   
  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, private service: StockageService,private router: Router) {

  }

  ngOnInit() {
    this.ListLocals();

    this.localFormGroup = this._formBuilder.group({
      localFormGroup: ['', Validators.required]
    });
 
  }

  //génerer la liste des locals
  ListLocals() {
    this.service.Locals().subscribe(data => {
      this.locals = data;
    });
  }

  //selectionner un local
  OpenEspaceTravail(id: any) {
    this.router.navigate(['/Menu/WMS/WMS-Stockage/Locals/Espace-Travail/', id]);

  }
   
}












