import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { fabric } from 'fabric';
 import { StockageService } from 'src/app/WMS/Stockage/services/stockage.service';
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
import 'fabric-history';
 
@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
  animations: [
    trigger('transformAnimation', [
      state('*', style({ transform: '{{transform}}' }), {
        params: { transform: 'scale(1)', duration: '0s' },
      }),
      transition('* => *', animate('{{duration}} ease')),
    ]),
  ],
})
export class FabricjsEditorComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;
  idLocal:any
  private canvas: fabric.Canvas;
  public props:any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    canvasImageBack: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  public textString: string;
  public url: string | ArrayBuffer = '';
  public urlback: string | ArrayBuffer = '';

  public size: any = {
    width: 900,
    height: 700
  };

  public json: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor(private sanitizer: DomSanitizer,private service: StockageService, private route: ActivatedRoute,
    private elementRef: ElementRef) {
    this.idLocal = this.route.snapshot.params['id'];

    const canv = new fabric.Canvas(document.querySelector('canvas'), {
      isDrawingMode: true
    })
    canv.undo()

  
  
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
  
    ngAfterViewChecked() {
     }
  ngAfterViewInit(): void {
    var json = ''
 

    
    this.service.Detail_carto(this.idLocal).subscribe((detail: any) => {        
       json = JSON.stringify(detail);
     console.log(json)

     this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas), function(o:any, object:any) {
      fabric.log(o, object);
  });
  })

    // setup front side canvas
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });
    


 
    this.canvas.on({
      'object:moving': (e) => {      console.log("move")
    },
      'object:modified': (e) => {       console.log("modif")
    },
      'selection:created': (e) => {
        const selectedObject = e.target;
        console.log("selectt",selectedObject.type)

        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();
          console.log("selectt",selectedObject.type)

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
          }
      
        }
      },
      'selection:cleared': (e) => {
        console.log("cleaar")

        this.selected = null;
        this.resetPanels();
      }      
 
    }
 );
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });
  







  }


  /*------------------------Block elements------------------------*/

  // Block "Size"

  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  // Block "Add text"

  addText() {
    if (this.textString) {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.loadSVGFromURL(el.src, (objects, options) => {
      const image = fabric.util.groupSVGElements(objects, options);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block "Upload Image"

  addImageOnCanvas(url:any) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  readUrlBack(event:any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.urlback = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url:any) {
    this.url = '';
  }
removeWhiteback(url:any) {
    this.urlback = '';
  }
  // Block "Add figure"

  addFigure(figure:any) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
        case 'lineHorizental':
            add=new fabric.Line([50, 100, 200, 200], {
                left: 170,
                angle: 327,
                top: 150,
                stroke: 'black'
            }
                 );
        break;
        case 'lineVerticale':
          add=new fabric.Line([50, 100, 200, 200], {
              left: 170,
              angle: 56,
              top: 150,
              stroke: 'black'
          }
               );
      break;
      case 'lineinclinpostive':
            add=new fabric.Line([50, 100, 200, 200], {
                left: 170,
                angle: 101,
                top: 150,
                stroke: 'black'
            }
                 );
        break;
        case 'lineinclinnegative':
          add=new fabric.Line([50, 100, 200, 200], {
              left: 170,
              angle: 11,
              top: 150,
              stroke: 'black'
          }
               );
      break;
        case 'dottedHorizental':
         add= new fabric.Line([50, 100, 200, 200], {
            left: 170,
            angle: 327,
            top: 150,
            strokeDashArray: [5, 5],
            stroke: 'black'
        });
        
      break;
      
       case 'dottedvertical':
        add= new fabric.Line([50, 100, 200, 200], {
           left: 170,
           angle: 11,
           top: 150,
           strokeDashArray: [5, 5],
           stroke: 'black'
       });
       
     break;
     case 'dottedinclinpositive':
      add= new fabric.Line([50, 100, 200, 200], {
         left: 170,
         angle: 101,
         top: 150,
         strokeDashArray: [5, 5],
         stroke: 'black'
     });     
     break;
     case 'dottedHorizentalinlinnegative':
      add= new fabric.Line([50, 100, 200, 200], {
         left: 170,
         angle: 56,
         top: 150,
         strokeDashArray: [5, 5],
         stroke: 'black'
     }); 
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj:any) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj:any, id:any) {
    obj.toObject = ((toObject) => {
      return function(this:any) {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }
//arriere plan image
  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }
//arriere plan image
setCanvasImageBack(url:any) {
//console.log("size",this.canvas.width)
  //const self = this;
    if (url) {
      fabric.Image.fromURL(url,  (img) => {          
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
         // scaleX: this.canvas.width / img.width,
         // scaleY: this.canvas.height / img.height
    
        });
    });

    }
}

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName:any, object:any) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName:any, value: string | number, object: fabric.IText) {
    object = object || this.canvas.getActiveObject() as fabric.IText;
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style:any = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({underline: true});
        } else {
          object.setSelectionStyles({underline: false});
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({overline: true});
        } else {
          object.setSelectionStyles({overline: false});
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({linethrough: true});
        } else {
          object.setSelectionStyles({linethrough: false});
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
        object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name:any) {
    const object:any = this.canvas.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name:any, value:any) {
    const object = this.canvas.getActiveObject();
    if (!object) { return; }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value:any) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value:any) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value:any) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm("Êtes-vous sûr de vider l'espace?")) {
      this.canvas.clear();
    }
  }
  drawLine() {
    var line:any, isDown:any;

    this.canvas.on('mouse:down', (o) =>{
      isDown = true;
      var pointer = this.canvas.getPointer(o.e);
      var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
      line = new fabric.Line(points, {
        strokeWidth: 5,
        fill: 'red',
        stroke: 'red',
        originX: 'center',
        originY: 'center'
      });
      this.canvas.add(line);
    });
    
    this.canvas.on('mouse:move', (o) =>{
      if (!isDown) return;
      var pointer = this.canvas.getPointer(o.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      this.canvas.renderAll();
    });
    
    this.canvas.on('mouse:up', function(o){
      isDown = false;
      
    });
  }
  stopdrawLine() {
    console.log('stop')
 
     this.canvas.hoverCursor= 'pointer',
    this.canvas.selection=true
     
  }
  rasterize() {
    const image = new Image();
    image.src = this.canvas.toDataURL({format: 'png'});
    const w = window.open('');
    w.document.write(image.outerHTML);
  }
   setLineControls(line:any)
  {
    line.setControlVisible("tr",false);
    line.setControlVisible("tl",false);
    line.setControlVisible("br",false);
    line.setControlVisible("bl",false);
    line.setControlVisible("ml",false);
    line.setControlVisible("mr",false);
  }
   createLine(points:any)
		{
			var line = new fabric.Line(points,
			{
				strokeWidth: 3,
				stroke: 'black',
				originX: 'center',
				originY: 'center',
				lockScalingX:true,
 				//lockScalingY:false,
			});
			this.setLineControls(line);
			return line;
		}
    createDottedLine(points:any)
		{
			var line = new fabric.Line(points,
			{
				strokeWidth: 3,
				stroke: 'black',
				originX: 'center',
				originY: 'center',
				lockScalingX:true,
        strokeDashArray: [5, 5],
				//lockScalingY:false,
			});
			this.setLineControls(line);
			return line;
		}
   addArrowVerticaleDroite()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addArrowVerticaleGauche()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addArrowHorizentaleDroite()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     grp.angle=90;
    this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addArrowHorizentaleGauche()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     grp.angle=90;
    this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addDottedArrowVerticaleGauche()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createDottedLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addDottedArrowDroite()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createDottedLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addDottedArrowHorizentaleGauche()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createDottedLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     grp.angle=90;
    this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
  addDottedArrowHorizentaleDroite()
  {
    var pts = [100,100,100,200];
    var triangle = this.createArrowHead(pts);
    var line = this.createDottedLine(pts);
    var grp = new fabric.Group([triangle,line]);			
     grp.angle=90;
    this.setLineControls(grp);
    this.canvas.add(grp);
    // var arrow = new fabric.LineArrow(pts,{left:100,top:100,fill:color()});
    // setLineControls(arrow);
    // canvas.add(arrow);
  }
   createArrowHead(points:any)
		{
			var headLength = 15,

					x1 = points[0],
					y1 = points[1],
					x2 = points[2],
					y2 = points[3],

					dx = x2 - x1,
					dy = y2 - y1,

					angle = Math.atan2(dy, dx);

			angle *= 180 / Math.PI;
			angle += 90;

			var triangle = new fabric.Triangle({
				angle: angle,
				fill: 'black',
				top: y2,
				left: x2,
				height: headLength,
				width: headLength,
				originX: 'center',
				originY: 'center',
				// lockScalingX:false,
				// lockScalingY:true,
			});

			return triangle;
		}
  rasterizeSVG() {
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }
  url0:any;
  carto:any
   saveCanvasToJSON(local:any) {
    var formData: any = new FormData();

    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);
    const blob = new Blob([JSON.stringify(this.canvas)], { type: 'application/json' });
    var myFile = this.convertBlobFichier(blob, "assets/cartographie.json");
    formData.append('Id_Local', local);
    formData.append('Detail', myFile);
     console.log(blob)
     this.service.saveCarto(formData).subscribe( data =>{
      console.log("carto change",data);
      },
   error => console.log(error)); 



    
  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      console.log('CANVAS untar');
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's "name" is preserved
      console.log('this.canvas.item(0).name');
      console.log(this.canvas);
    });

  }

  rasterizeJSON() {
    var formData: any = new FormData();
    this.json = JSON.stringify(this.canvas, null, 2);
    const userBlob = new Blob((this.json),{ type: "application/json"});
    formData.append('cartographie', userBlob);
    console.log(formData)
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
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
  
}
function eventHandler(arg0: string, eventHandler: any) {
  throw new Error('Function not implemented.');
}

 

