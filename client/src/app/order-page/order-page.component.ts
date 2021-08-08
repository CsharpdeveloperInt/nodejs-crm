import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, Params } from '@angular/router';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrderService } from '../shared/services/order.service';
import { Order_backendService } from '../shared/services/order_backend.service';
import { MaterialInstance, MaterialService } from './../shared/services/material.service';
import { error } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit,OnDestroy,AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef


  isRoot:boolean
  modal:MaterialInstance
  pending = false
  oSub: Subscription

  constructor(private router: Router,public order: OrderService, private orderService: Order_backendService) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event=>{
      if (event instanceof NavigationEnd){
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy(){
    this.modal.destroy()
    if(this.oSub){
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  openModal(){
    this.modal.open()
  }

  cancel(){
    this.modal.close()
  }

  submit(){
    this.pending = true

    const order :Order = {
      list: this.order.list.map(item=>{
        delete item._id
        return item
      })
    }
    this.oSub = this.orderService.create(order).subscribe(
      newOrder=>{
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.messages),
      ()=>{
        this.modal.close()
        this.pending = false
      }
    )

  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }
}
