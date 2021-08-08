import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OverviewPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';
import { MaterialInstance, MaterialService } from './../shared/services/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit,OnDestroy,AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef
  data$ : Observable<OverviewPage>
  tapTarget: MaterialInstance
  yesterday = new Date()


  constructor(private serviceAnalytics : AnalyticsService) { }

  ngOnInit(): void {
    this.data$ = this.serviceAnalytics.getOverView()
    this.yesterday.setDate(this.yesterday.getDate()-1)

  }

  ngAfterViewInit(){
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(){
    this.tapTarget.destroy()
  }

  openInfo(){
    this.tapTarget.open()
  }
}
