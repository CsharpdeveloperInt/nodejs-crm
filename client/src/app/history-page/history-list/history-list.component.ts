import { Component, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Order } from 'src/app/shared/interfaces';
import { MaterialInstance, MaterialService } from './../../shared/services/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy,AfterViewInit {

  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef

  selectedOrder: Order
  modal: MaterialInstance


  computePrice(order:Order):number{
    return order.list.reduce((total,item)=>{
      return total += item.quantity * item.cost
    },0)
  }

  ngOnDestroy(){
    this.modal.destroy()
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }


  closeModal(){
    this.modal.close()
  }

}
