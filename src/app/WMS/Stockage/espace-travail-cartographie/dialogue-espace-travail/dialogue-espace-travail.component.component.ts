import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { style } from '@angular/animations';


@Component({
  selector: 'app-dialogue-espace-travail',
  templateUrl: './dialogue-espace-travail.component.html',
  styleUrls: ['./dialogue-espace-travail.component.scss']
})
export class DialogueEspacaTravailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'add-arrow',
  templateUrl: './add-arrow.component.html',
})
export class ArrowEspaceTravailDialogComponent implements OnInit {
  ngOnInit(): void {
  }
  alignement: string = 'vertical'
  style: string = 'simple'
  directionDG: string = 'gauche'
  directionHB: string = 'haut'
  canvas: any
  constructor(public dialogRef: MatDialogRef<ArrowEspaceTravailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private router: Router, private http: HttpClient) {

    this.canvas = data.canvas
  }
  public addArrowHorizentale() {
    this.canvas.addArrowHorizentale();

  }
  public addArrowVerticale() {
    this.canvas.addArrowVerticale();

  }
  public addDottedArrowHorizentale() {
    this.canvas.addDottedArrowHorizentale();

  }
  public addDottedArrowVerticale() {
    this.canvas.addDottedArrowVerticale();

  }
  onSubmit() {

    //simple vertical
    if ((this.style == 'simple') && (this.alignement == 'vertical') && (this.directionDG == 'gauche')) {
      this.addArrowVerticale();
      this.close()
    }
    if ((this.style == 'simple') && (this.alignement == 'vertical') && (this.directionDG == 'droite')) {
      this.addArrowVerticale();
      this.close()
    }
    //simple horizentale
    if ((this.style == 'simple') && (this.alignement == 'horizental') && (this.directionDG == 'gauche')) {
      this.addArrowHorizentale();
      this.close();
    }
    if ((this.style == 'simple') && (this.alignement == 'horizental') && (this.directionDG == 'droite')) {
      this.addArrowHorizentale();
      this.close();
    }

    //pointée vertical
    if ((this.style == 'pointee') && (this.alignement == 'vertical') && (this.directionDG == 'gauche')) {
      this.addDottedArrowVerticale();
      this.close();
    }
    if ((this.style == 'pointee') && (this.alignement == 'vertical') && (this.directionDG == 'droite')) {
      this.addDottedArrowVerticale();
      this.close();
    }
    //pointée horizental
    if ((this.style == 'pointee') && (this.alignement == 'horizental') && (this.directionDG == 'gauche')) {
      this.addDottedArrowHorizentale();
      this.close();
    }
    if ((this.style == 'pointee') && (this.alignement == 'horizental') && (this.directionDG == 'droite')) {
      this.addDottedArrowHorizentale();
      this.close();
    }

  }
  public addFigure(figure: any) {
    this.canvas.addFigure(figure);
  }

  //fermer dialogue
  close() {

    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-line.component',
  templateUrl: './add-line.component.html',
})
export class LineEspaceTravailDialogComponent implements OnInit {
  ngOnInit(): void {
  }
  canvas: any
  alignement: string = 'vertical'
  style: string = 'simple'
  constructor(public dialogRef: MatDialogRef<ImageEspaceTravailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private router: Router, private http: HttpClient) {

    this.canvas = data.canvas
  }

  onSubmit() {

    if ((this.style == 'simple') && (this.alignement == 'vertical')) {
      this.addFigure('lineVerticale');
      this.close()
    }
    if ((this.style == 'simple') && (this.alignement == 'horizental')) {
      this.addFigure('lineHorizental')
      this.close();
    }


    if ((this.style == 'simple') && (this.alignement == '45')) {
      this.addFigure('lineinclinpostive');
      this.close()
    }
    if ((this.style == 'simple') && (this.alignement == '-45')) {
      this.addFigure('lineinclinnegative')
      this.close();
    }


    if ((this.style == 'pointee') && (this.alignement == 'vertical')) {
      this.addFigure('dottedvertical')
      this.close();
    }
    if ((this.style == 'pointee') && (this.alignement == 'horizental')) {
      this.addFigure('dottedHorizental')
      this.close();
    }
    if ((this.style == 'pointee') && (this.alignement == '45')) {
      this.addFigure('dottedinclinpositive')
      this.close();
    }
    if ((this.style == 'pointee') && (this.alignement == '-45')) {
      this.addFigure('dottedHorizentalinlinnegative')
      this.close();
    }
  }
  public addFigure(figure: any) {
    this.canvas.addFigure(figure);
  }

  //fermer dialogue
  close() {

    this.dialogRef.close();
  }
}

@Component({
  selector: 'image-espace-travail-dialog',
  templateUrl: './image-espace-travail.component.html',
})
export class ImageEspaceTravailDialogComponent implements OnInit {
  ngOnInit(): void {
  }
  canvas: any
  constructor(public dialogRef: MatDialogRef<ImageEspaceTravailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private router: Router, private http: HttpClient) {

    this.canvas = data.canvas
  }

  onSubmit() {


  }
  public getImgPolaroid(event: any) {
    this.canvas.getImgPolaroid(event);
  }
  //fermer dialogue
  close() {

    this.dialogRef.close();
  }
}

