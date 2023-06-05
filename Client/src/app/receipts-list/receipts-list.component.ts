import {Component, Input, OnInit, Output} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {ReceiptsHttpService} from "../Services/receipts-http.service";
import Receipt from "../models/Receipt";


@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css']
})
export class ReceiptsListComponent implements OnInit {
  @Input() public receipts : Receipt[] = [];

  constructor(private us : UserHttpService, private router : Router, private rs : ReceiptsHttpService) {}

  ngOnInit(): void {
    if (!this.us.hasRole("Cashier")) this.router.navigate(['/login']);
  }

  //todo aggiungi date
  daylyProfit() {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedDateTime = formatter.format(new Date());
    const [formattedDate, formattedTime] = formattedDateTime.split(', ');
    const todayReceipts = this.receipts.filter((receipt) => receipt.date.toString() === formattedDate);
    let profit : number = 0;

    for(let i = 0; i < todayReceipts.length; i++){
      profit += todayReceipts[i].price;
    }
    return profit;
  }

  //todo fai in modo che selezioni solo lunedì come giorno di partenza
  weeklyProfit() {
    const currentDate = new Date();

    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() + 6));
    firstDayOfWeek.setHours(23, 59, 59, 999);
    console.log(lastDayOfWeek)
    const weeklyReceipts = this.receipts.filter((receipt) => {
      const date = new Date(receipt.date)
      // console.log(new Date(receipt.date));
      return date >= firstDayOfWeek && date <= lastDayOfWeek;
    });

    let profit: number = 0;
    for (let i = 0; i < weeklyReceipts.length; i++) {
      profit += weeklyReceipts[i].price;
    }

    console.log(profit)

    return profit;
  }

  monthlyProfit(){
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      month: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedMonth = formatter.format(currentDate);
    const monthlyReceipt = this.receipts.filter((receipt) => parseInt(receipt.date.toString().split('/')[1], 10).toString() === formattedMonth);
    let profit : number = 0;

    for(let i = 0; i < monthlyReceipt.length; i++){
      profit += monthlyReceipt[i].price;
    }
    return profit;
  }

  yearlyProfit() {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      year: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedYear = formatter.format(currentDate);
    const yearlyReceipt = this.receipts.filter((receipt) => parseInt(receipt.date.toString().split('/')[2], 10).toString() === formattedYear);
    let profit : number = 0;

    for(let i = 0; i < yearlyReceipt.length; i++){
      profit += yearlyReceipt[i].price;
    }
    console.log((profit))
    return profit;
  }
}
