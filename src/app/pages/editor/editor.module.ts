import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ImageCropperModule } from '../../image-cropper/image-cropper.module';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    FormsModule,
    MatButtonModule,
    FormsModule,
    ImageCropperModule,
    MatFormFieldModule
  ]
})
export class EditorModule { }
