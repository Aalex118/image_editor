import { HttpClient, HttpEventType  } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../../image-cropper/interfaces/index';
import {base64ToFile} from '../../image-cropper/utils/blob.utils';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations:[ trigger('rotatedState', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(-90deg)' })),
    state('rotated1', style({ transform: 'rotate(-180deg)' })),
    state('rotated2', style({ transform: 'rotate(-270deg)' })),
    state('rotated3', style({ transform: 'rotate(-360deg)' })),
  ]),
  trigger('rotatedStateRight', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(90deg)' })),
    state('rotated1', style({ transform: 'rotate(180deg)' })),
    state('rotated2', style({ transform: 'rotate(270deg)' })),
    state('rotated3', style({ transform: 'rotate(360deg)' })),
  ]),
  ]
})
export class EditorComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  state: string = 'default';
  isFlipped: boolean = false;

  sepia=0;
  grayScale=0;
  hueRotate=0;
  saturate=1;
  brightness=1;
  blur=0;
  
  fileData: File = null;
  previewUrl:any = null;
  uploadedFilePath: string = null;
 
  constructor(private http: HttpClient) { }

fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}

imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
}

imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
}

cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
}

loadImageFailed() {
    console.log('Load failed');
}

rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
}

rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
}

private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
}


flipHorizontal() {
    this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH
    };
}

flipVertical() {
    this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV
    };
}

resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
}

zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
    this.transform = {
        ...this.transform,
        rotate: this.rotation
    };
}

  flipY(){
    if (this.isFlipped === false) {
      this.isFlipped = true;
    } else {
      this.isFlipped = false;
    }
    
  }

  rotateLeft2() {
    if (this.state === 'default') {
      this.state = 'rotated';
    } else if (this.state === 'rotated') {
      this.state = 'rotated1';
    } else if (this.state === 'rotated1') {
      this.state = 'rotated2';
    } else if (this.state === 'rotated2') {
      this.state = 'rotated3';
    } else if(this.state === 'rotated3'){
        this.state = 'rotated'
    }
  }
  base64Image: any;

fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
}
 
preview() {
    
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    let reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
}

downloadImage() {
  let imageUrl = this.croppedImage;

  this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
    console.log(base64data);
    this.base64Image = "data:image/jpg;base64," + base64data;
    
    let link = document.createElement("a");

    document.body.appendChild(link); 

    link.setAttribute("href", this.base64Image);
    link.setAttribute("download", "downloaded_img.jpg");
    link.click();
  });
}

getBase64ImageFromURL(url: string) {
  return Observable.create((observer: Observer<string>) => {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    if (!img.complete) {
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = err => {
        observer.error(err);
      };
    } else {
      observer.next(this.getBase64Image(img));
      observer.complete();
    }
  });
}

getBase64Image(img: HTMLImageElement) {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const dataURL: string = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

  ngOnInit(): void {
  }

}
