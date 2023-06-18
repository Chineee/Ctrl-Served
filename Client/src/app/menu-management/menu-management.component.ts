import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Dish } from '../models/Dish';
import { MenusHttpService } from '../Services/menus-http.service';


@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
  @Input() foods : Dish[] = [];
  @Input() drinks : Dish[] = [];
  protected selected : 'Food' | 'Drink' = 'Food';

  protected success : {success ?: boolean, message ?: string} = {};
  protected newDish : {dishName ?: string, dishPrice ?: number, dishPreparationTime ?: number, dishType ?: string} = {};

  constructor(private ms : MenusHttpService){}

  typeSelected() : Dish[] {
    return this.selected === 'Food' ? this.foods : this.drinks;
  }

  ngOnInit() : void {

  }

  modifyDish() : void {

  }

  createDish() : void {
   
    const newDish = {
      name: this.newDish.dishName,
      type: this.newDish.dishType,
      productionTime: this.newDish.dishPreparationTime,
      price: this.newDish.dishPrice
    };

    this.ms.addDish(newDish).subscribe({
      next: () => {
        this.success = {success: true, message: "Dish added successfully"}
        this.newDish = {}
      }
    });
  }

  deleteDish() : void {

  }

  existsDish() : boolean {
    if (this.newDish.dishType !== 'Food' && this.newDish.dishType !== 'Drink') return true;
    let res = false;
    switch (this.newDish.dishType) {
      case 'Food':
        res = this.foods.some((food)=>food.name === this.newDish.dishName);
        break;
      case 'Drink': 
        res = this.drinks.some((drink) => drink.name === this.newDish.dishName);
        break;
    };
    
    if (!this.newDish.dishPreparationTime) res = true;
    if(!this.newDish.dishPrice) res = true;

    return res;
  }

  changeSelect(select : 'Food' | 'Drink') : void {
    this.selected = select;
  }

  setErrorFalse() : void {
    this.success = {}
  }
}
