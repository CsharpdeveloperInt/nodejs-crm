import { Injectable } from '@angular/core';
import { OrderPosition, Position } from '../interfaces';

@Injectable()
export class OrderService{

  public list: OrderPosition[] = []
  public price = 0

  add(pos: Position){
    const orderPosition: OrderPosition = Object.assign({},{
      name: pos.name,
      cost: pos.cost,
      quantity: pos.quantity,
      _id: pos._id
    })
    const cond = this.list.find(p=>p._id === orderPosition._id)
    if (cond){
      cond.quantity += orderPosition.quantity
    }
    else{
      this.list.push(orderPosition)
    }
    this.computePrice()
  }
  remove(pos: OrderPosition){
    const idx = this.list.findIndex(p=>p._id === pos._id)
    this.list.splice(idx,1)
    this.computePrice()
  }
  clear(){
    this.list = []
    this.price = 0
  }
  private computePrice(){
    this.price = this.list.reduce((total,item)=>{
      return total += item.quantity * item.cost
    },0)
  }
}
