import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef

  isNew = true
  imagePreview = ''
  image: File
  form: FormGroup
  lCat: Category

  constructor(private route: ActivatedRoute,private catService: CategoriesService) {

  }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null,Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']){
              this.isNew = false
              return this.catService.getById(params['id'])
            }
            return of(null)
          }
        )
      ).subscribe(
        (category: Category) => {
          if(category){

            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            this.lCat = category
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  onSubmit(){

    let obs$

    this.form.disable()
    if (this.isNew){
      obs$= this.catService.create(this.form.value.name,this.image)
    }
    else{
      console.log(this.form.value.name)
      obs$= this.catService.update(this.lCat._id,this.form.value.name,this.image)
    }

    obs$.subscribe(
      category=>{
        this.lCat = category
        console.log(category)
        MaterialService.toast('Изменения сохранены.')
        this.form.enable()
      },
      error =>{
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any){
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = ()=> {
      this.imagePreview = reader.result as string;
    }

    reader.readAsDataURL(file)
  }

}
