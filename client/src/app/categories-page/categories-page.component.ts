import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/interfaces';
import { CategoriesService } from '../shared/services/categories.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categories$: Observable<Category[]>

  constructor(private catService: CategoriesService) { }

  ngOnInit() {
    this.categories$ = this.catService.fetch()
  }

}
