 import { ActivatedRoute, Router } from '@angular/router';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
 import { Fiche_Local } from 'src/app/WMS/Classe/Stockage/Fiche_Local';
 import Swal from 'sweetalert2';
import { StockageService } from '../services/stockage.service';
import { FabricjsEditorComponent } from './angular-editor-fabric-js/src/public-api';
 import { Component, OnInit, HostListener, HostBinding ,ViewChild,Input, ElementRef} from '@angular/core';
 import { MatDialog } from '@angular/material/dialog';
 import { ArrowEspaceTravailDialogComponent, ImageEspaceTravailDialogComponent, LineEspaceTravailDialogComponent } from './dialogue-espace-travail/dialogue-espace-travail.component.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
@Component({
  selector: 'app-espace-travail-cartographie',
  templateUrl: './espace-travail-cartographie.component.html',
  styleUrls: ['./espace-travail-cartographie.component.scss'],
  animations: [
    trigger('transformAnimation', [
      state('*', style({ transform: '{{transform}}' }), {
        params: { transform: 'scale(1)', duration: '0s' },
      }),
      transition('* => *', animate('{{duration}} ease')),
    ]),
  ],
})

export class EspaceTravailCartographieComponent implements OnInit {
idLocal:any
 local: Fiche_Local = new Fiche_Local()
@ViewChild('canvas', {static: false}) canvas: FabricjsEditorComponent;
title = 'angular-editor-fabric-js';
showTools=true

  constructor(private service: StockageService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private elementRef: ElementRef) {    

    }
    private scale = 1;
    private translate: [number, number] = [0, 0];
    private translateOnPanStart: [number, number] = [0, 0];
  
    transformAnimationState = {
      value: null as number,
      params: {
        transform: 'scale(1)',
        duration: '0s'
      }
    };
  
   
    @HostListener('mousewheel', ['$event'])
    onMouseWheel(e: any) {
  
      const currentScale = this.scale;
      const newScale = clamp(this.scale + Math.sign(e.wheelDelta) / 10.0, 1, 3.0);
      if (currentScale !== newScale) {
  
  
        this.translate = this.calculateTranslationToZoomPoint(currentScale, newScale, this.translate, e);
        this.scale = newScale;
  
        this.updateTransformAnimationState();
      }
     
      e.preventDefault();
    }
  
    private calculateTranslationToZoomPoint(currentScale: number, newScale: number, currentTranslation: [number, number],  e: {clientX: number, clientY: number}, ): [number, number] {
        
      const [eventLayerX, eventLayerY] = this.projectToLayer(e);
  
      const xAtCurrentScale = (eventLayerX - currentTranslation[0]) / currentScale;
      const yAtCurrentScale = (eventLayerY - currentTranslation[1]) / currentScale;
  
      const xAtNewScale = xAtCurrentScale * newScale;
      const yAtNewScale  = yAtCurrentScale * newScale;
  
      return [eventLayerX - xAtNewScale, eventLayerY - yAtNewScale];
    }
  
    private projectToLayer(eventClientXY: {clientX: number, clientY: number}): [number, number] {
      const layerX = Math.round(eventClientXY.clientX - this.clientX);
      const layerY = Math.round(eventClientXY.clientY - this.clientY);
      return [layerX, layerY];
    }
  
    private get clientX() {
      return (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect().left;
    }
  
    private get clientY() {
      return (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect().top;
    }
  
    private updateTransformAnimationState(duration = '.5s') {
      this.transformAnimationState = {
        value: this.scale + this.translate[0] + this.translate[1],
        params: {
          transform: `translate3d(${this.translate[0]}px, ${this.translate[1]}px, 0px) scale(${this.scale})`,
          duration
        }
      }
    }
  
    reset() {
      this.scale = 1;
      this.translate = [0, 0];
      this.updateTransformAnimationState();
    }
  
    @HostListener('panstart', ['$event'])
    onPanStart(e: Event) {
      this.translateOnPanStart = [...this.translate] as [number, number];
      e.preventDefault();
    }
  
    @HostListener('pan', ['$event'])
    onPan(e: Event & {deltaX: number, deltaY: number}) {
      this.translate = [this.translateOnPanStart[0] + e.deltaX, this.translateOnPanStart[1] + e.deltaY];
      this.updateTransformAnimationState('0s');
      e.preventDefault();
    }
  
  ngOnInit(): void 
  {
    this.idLocal = this.route.snapshot.params['id'];

    this.service.getLocalById(this.idLocal).subscribe(data => {
      this.local = data
      }, error => console.log(error));
      
  }
 
  public rasterize() {
    this.canvas.rasterize();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
  }
   
   public saveCanvasToJSON() {
   Swal.fire({
    title: 'Voulez-vous enregistrer les modifications?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Oui',
    denyButtonText: `Non, Annuler`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
     this.canvas.saveCanvasToJSON(this.idLocal);
    //   this.canvas.saveCanvasToJSON();

      Swal.fire('Modifications Enregistrée!', '', 'success')
    } else if (result.isDenied) {
      Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
    }
  })
  

  }

  public loadCanvasFromJSON() {
    this.canvas.loadCanvasFromJSON();
  }
  hideTools(){
    this.showTools=false
  }
  showTool(){
    this.showTools=true
  }
  public confirmClear() {
    this.canvas.confirmClear();
  }
  public drawLine() {
    this.canvas.drawLine();
  }
  public StopdrawLine() {
    this.canvas.stopdrawLine()}
  
  public changeSize() {
    this.canvas.changeSize();
  }
  //bouton plus pour plus d'inormation sur le local selectionné
  openDialogImageEspace() {
    //ouvrir la boite dialogue DialogInfoLocal
    const dialogRef = this.dialog.open(ImageEspaceTravailDialogComponent, {
      width: 'auto',
      data: {  canvas:this.canvas }
    });
  }
  openDialogLine() {
    //ouvrir la boite dialogue DialogInfoLocal
    const dialogRef = this.dialog.open(LineEspaceTravailDialogComponent, {
      width: 'auto',
      data: {  canvas:this.canvas }
    });
  }
  openDialogArrow() {
    //ouvrir la boite dialogue DialogInfoLocal
    const dialogRef = this.dialog.open(ArrowEspaceTravailDialogComponent, {
      width: 'auto',
      data: {  canvas:this.canvas }
    });
  }
  public addText() {
    this.canvas.addText();
  }

  public getImgPolaroid(event:any) {
    this.canvas.getImgPolaroid(event);
  }

  public addImageOnCanvas(url:any) {
    this.canvas.addImageOnCanvas(url);
  }

  public readUrl(event:any) {
    this.canvas.readUrl(event);
  }
  public readUrlBack(event:any) {
    this.canvas.readUrlBack(event);
  }
  addTextShow=false

  addTextToggle(){
    this.addTextShow=!this.addTextShow
  }
  public removeWhite(url:any) {
    this.canvas.removeWhite(url);
  }
public removeWhiteback(url:any) {
    this.canvas.removeWhiteback(url);
  }
  public addFigure(figure:any) {
    this.canvas.addFigure(figure);
  }

  public removeSelected() {
    this.canvas.removeSelected();
  }

  public sendToBack() {
    this.canvas.sendToBack();
  }

  public bringToFront() {
    this.canvas.bringToFront();
  }

  public clone() {
    this.canvas.clone();
  }

  public cleanSelect() {
    this.canvas.cleanSelect();
  }

  public setCanvasFill() {
    this.canvas.setCanvasFill();
  }

  public setCanvasImage() {
    this.canvas.setCanvasImage();
  }
  public setCanvasImageBack(url:any) {
    this.canvas.setCanvasImageBack(url);
  }
  public setId() {
    this.canvas.setId();
  }

  public setOpacity() {
    this.canvas.setOpacity();
  }

  public setFill() {
    this.canvas.setFill();
  }

  public setFontFamily() {
    this.canvas.setFontFamily();
  }

  public setTextAlign(value:any) {
    this.canvas.setTextAlign(value);
  }

  public setBold() {
    this.canvas.setBold();
  }

  public setFontStyle() {
    this.canvas.setFontStyle();
  }

  public hasTextDecoration(value:any) {
    this.canvas.hasTextDecoration(value);
  }

  public setTextDecoration(value:any) {
    this.canvas.setTextDecoration(value);
  }

  public setFontSize() {
    this.canvas.setFontSize();
  }

  public setLineHeight() {
    this.canvas.setLineHeight();
  }

  public setCharSpacing() {
    this.canvas.setCharSpacing();
  }

  public rasterizeJSON() {
    this.canvas.rasterizeJSON();
  }
  saveCarto(){
    var formData: any = new FormData();
    formData.append('id', this.idLocal);
    this.service.saveCarto(formData).subscribe( data =>{
      console.log("carto change",data);
      },
   error => console.log(error)); 
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
  
    //Cast to a File() type
    return <File>theBlob;
  }
  
  
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }



  public locale: string = "en";
  public width = window.innerWidth - 150;
  public height = window.innerHeight - 180;
  public type: string = 'component';

  public disabled: boolean = false;

  public config: PerfectScrollbarConfigInterface = {
    useBothWheelAxes: true, suppressScrollX: false, suppressScrollY: false
  };

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

 
  public toggleType(): void {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  public scrollToXY(x: number, y: number): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollTo(x, y, 500);
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollTo(x, y, 500);
    }
  }

  public scrollToTop(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToTop();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToTop();
    }
  }

  public scrollToLeft(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToLeft();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToLeft();
    }
  }

  public scrollToRight(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToRight();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToRight();
    }
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    console.log(event);
  }
   
 
}
