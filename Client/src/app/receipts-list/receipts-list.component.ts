import {Component, Input, OnInit, Output} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {ReceiptsHttpService} from "../Services/receipts-http.service";
import Receipt from "../models/Receipt";

enum RangeProfit {
  DAILY,
  WEEKLY,
  MONTHLY,
  YEARLY
}

@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css'],
})
export class ReceiptsListComponent implements OnInit {
  @Input() public receipts : Receipt[] = [];
  protected funcSelected : Function = this.dailyProfit;
  protected RangeProfit = RangeProfit;

  constructor(private us : UserHttpService, private router : Router, private rs : ReceiptsHttpService) {}

  ngOnInit(): void {
    if (!this.us.hasRole("Cashier")) this.router.navigate(['/login']);
  }

  //todo aggiungi date
  dailyProfit(date : Date) {
    console.log('daily')
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedDateTime = formatter.format(date);
    const [formattedDate, formattedTime] = formattedDateTime.split(', ');
    const todayReceipts = this.receipts.filter((receipt) => receipt.date.toString() === formattedDate);
    let profit : number = 0;

    for(let i = 0; i < todayReceipts.length; i++){
      profit += todayReceipts[i].price;
    }
    console.log(profit)
    return profit;
  }

  getToday() {
    let today = new Date().toLocaleDateString().split('/');
    return today[2] + '-' + today[1].padStart(2, '0') + '-' + today[0].padStart(2, '0');
  }

  handleDataSelection(date : any) {
    // this.dailyProfit(new Date(date));
    this.funcSelected(new Date(date));
  }

  weeklyProfit(currentDate : Date) {
    console.log('weekly')

    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() + 6));
    firstDayOfWeek.setHours(23, 59, 59, 999);
    const weeklyReceipts = this.receipts.filter((receipt) => {
      const dateString = receipt.date.toString().split('/');
      const date = new Date(`${dateString[1]}/${dateString[0]}/${dateString[2]}`).getTime()
      return date >= new Date(firstDayOfWeek).getTime() && date <= new Date(lastDayOfWeek).getTime();

    });

    console.log(firstDayOfWeek)
    console.log(lastDayOfWeek)

    let profit: number = 0;
    for (let i = 0; i < weeklyReceipts.length; i++) {
      profit += weeklyReceipts[i].price;
    }

    console.log(profit)

    return profit;
  }

  setFunc(type : RangeProfit) : void {
    switch (type) {
      case RangeProfit.DAILY:
        this.funcSelected = this.dailyProfit;
        break;
      case RangeProfit.MONTHLY:
        this.funcSelected = this.monthlyProfit;
        break;
      case RangeProfit.WEEKLY:
        this.funcSelected = this.weeklyProfit;
        break;
      case RangeProfit.YEARLY:
        this.funcSelected = this.yearlyProfit;
    }
  }

  monthlyProfit(currentDate: Date){
    console.log('monthly')

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      month: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedMonth = formatter.format(currentDate);
    const monthlyReceipt = this.receipts.filter((receipt) =>  parseInt(receipt.date.toString().split('/')[1], 10).toString() === formattedMonth)
    let profit : number = 0;
    for(let i = 0; i < monthlyReceipt.length; i++){
      profit += monthlyReceipt[i].price;
    }
    console.log(profit)
    return profit;
  }

  yearlyProfit(currentDate: Date) {
    console.log('yearly')

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
