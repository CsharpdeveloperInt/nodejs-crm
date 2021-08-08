import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from 'src/app/shared/interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { map, switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/services/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  position$ : Observable<Position[]>

  constructor(private route: ActivatedRoute,private posService: PositionsService,private orderService: OrderService) { }

  ngOnInit(): void {
    this.position$ = this.route.params
    .pipe(
      switchMap(
        (params: Params)=>{
          return this.posService.fetch(params['id'])
        }
      ),map(
        (positions: Position[])=>{
          return positions.map(position=>{
            position.quantity = 1
            return position
          })
        }
      )
    )

  }

  addToOrder(pos: Position){
    MaterialService.toast(`Добавлено x${pos.quantity}`)
    this.orderService.add(pos)
  }

}
