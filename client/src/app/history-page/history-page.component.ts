import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from './../shared/services/material.service';
import { Subscription } from 'rxjs';
import { Order_backendService } from '../shared/services/order_backend.service';
import { Order } from '../shared/interfaces';
import { Filter } from './../shared/interfaces';

const STEP = 3


@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})

export class HistoryPageComponent implements OnInit,OnDestroy,AfterViewInit {

  @ViewChild('toolTip') toolTipRef: ElementRef
  toolTip: MaterialInstance
  isFilterVisible = false
  oSub :Subscription
  orders : Order[] = []


  offset = 0
  limit = STEP
  loading = false
  reloading = false
  noMoreOrders = false
  filter: Filter = {}

  constructor(private orderService: Order_backendService) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch(){
    const params = Object.assign({},this.filter,{
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.orderService.fetch(params).subscribe(newOrders=>{
      this.orders = this.orders.concat(newOrders)
      console.log(newOrders.length)
      this.noMoreOrders = newOrders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  ngOnDestroy(){
    this.toolTip.destroy()
    if(this.oSub){
      this.oSub.unsubscribe()
    }
  }

  loadMore(){
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyFilter(filter: Filter){
    this.orders = []
    this.offset = 0
    this.reloading = true
    this.filter = filter
    this.fetch()
  }

  ngAfterViewInit(){
    this.toolTip = MaterialService.initTooltip(this.toolTipRef)
  }

  isFiltred():boolean{
    return Object.keys(this.filter).length !== 0
  }

}
