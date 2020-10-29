import { Position } from '../../../shared/interfaces';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { MaterialInstance, MaterialService } from './../../../shared/services/material.service';


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit,AfterViewInit,OnDestroy {


  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[]=[]
  loading = false
  modal:MaterialInstance

  constructor(private posService: PositionsService) { }

  ngOnInit(): void {
    this.loading = true
    this.posService.fetch(this.categoryId).subscribe(
      pos =>{
        this.positions = pos
        this.loading = false
      }
    )
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(){
    this.modal.destroy()
  }

  onSelectPosition(position: Position){
    this.modal.open()
  }
  onAddPosition(){
    this.modal.open()
  }

  onCancel(){
    this.modal.close()
  }
}
