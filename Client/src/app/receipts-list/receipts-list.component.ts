import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {UserHttpService} from "../Services/user-http.service";
import {Router} from "@angular/router";
import {ReceiptsHttpService} from "../Services/receipts-http.service";
import Receipt from "../models/Receipt";

enum RangeProfit {
  DAILY='Daily',
  WEEKLY='Weekly',
  MONTHLY='Monthly',
  YEARLY='Yearly'
}

@Component({
  selector: 'app-receipts-list',
  templateUrl: './receipts-list.component.html',
  styleUrls: ['./receipts-list.component.css'],
})
export class ReceiptsListComponent implements OnInit {

  private _receipts : Receipt[] = []

  @Input() set receipts(receipts_array : Receipt[]) {
    this._receipts = receipts_array
    this.profitClicked = this.dailyProfit(new Date());
    this.showReceipts(new Date());
  }
  get receipts() {
    return this._receipts;
  }
  
  @Output() openReceiptPopup : EventEmitter<Receipt> = new EventEmitter<Receipt>();

  protected funcSelected : Function = this.dailyProfit;
  protected RangeProfit = RangeProfit;
  protected profitClicked : number | undefined;
  protected rangeProfit = RangeProfit.DAILY;
  protected receiptFiltered : Receipt[] = [];
  constructor(private us : UserHttpService, private router : Router, private rs : ReceiptsHttpService) {}

  ngOnInit(): void {
    if (!this.us.hasRole("Cashier")) {
      this.router.navigate(['/login']);
    }
  }

  //todo aggiungi date
  dailyProfit(date : Date) {
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
    this.rangeProfit = RangeProfit.DAILY;
    this.profitClicked = parseFloat(profit.toFixed(2));
    return this.profitClicked;
  }

  getToday() {
    let today = new Date().toLocaleDateString().split('/');
    return today[2] + '-' + today[1].padStart(2, '0') + '-' + today[0].padStart(2, '0');
  }

  showReceipts(dateInput: Date) : void {
    this.receiptFiltered = this.receipts.filter((receipt) => {
      const receiptDate = receipt.date.toString().split('/')
      const today = dateInput.toLocaleDateString().split('/')
      if(this.rangeProfit === RangeProfit.DAILY) {
        return receipt.date.toString() === `${today[0]}/${today[1].padStart(2, '0')}/${today[2]}`;
      } else if (this.rangeProfit === RangeProfit.WEEKLY) {
        const firstDayOfWeek = new Date(dateInput);
        firstDayOfWeek.setDate(dateInput.getDate() - dateInput.getDay() + 1);
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const lastDayOfWeek = new Date(dateInput);
        lastDayOfWeek.setDate(dateInput.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        const date = new Date(`${receiptDate[1]}/${receiptDate[0]}/${receiptDate[2]}`).getTime()
        return date >= firstDayOfWeek.getTime() && date <= lastDayOfWeek.getTime();
      } else if (this.rangeProfit === RangeProfit.MONTHLY) {
        return receiptDate[1] == today[1].padStart(2, '0');
      } else {
        return receiptDate[2] === today[2];
      }
    });
  }

  handleDataSelection(date : any) {
    // this.dailyProfit(new Date(date));
    this.funcSelected(new Date(date));
    this.showReceipts(new Date(date));
  }

  weeklyProfit(currentDate : Date) {
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(currentDate);
    lastDayOfWeek.setDate(currentDate.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    const weeklyReceipts = this.receipts.filter((receipt) => {
      const dateString = receipt.date.toString().split('/');

      const date = new Date(`${dateString[1]}/${dateString[0]}/${dateString[2]}`).getTime()
      return date >= new Date(firstDayOfWeek).getTime() && date <= new Date(lastDayOfWeek).getTime();

    });

    let profit: number = 0;
    for (let i = 0; i < weeklyReceipts.length; i++) {
      profit += weeklyReceipts[i].price;
    }

    this.rangeProfit = RangeProfit.WEEKLY;
    this.profitClicked = parseFloat(profit.toFixed(2));
    return this.profitClicked;
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

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Rome',
      month: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    const formattedMonth = formatter.format(currentDate);
    const monthlyReceipt = this.receipts.filter((receipt) =>  parseInt(receipt.date.toString().split('/')[1], 10).toString() === formattedMonth && receipt.date.toString().split('/')[2].toString() === currentDate.toLocaleDateString().split('/')[2])
    let profit : number = 0;
    for(let i = 0; i < monthlyReceipt.length; i++){
      profit += monthlyReceipt[i].price;
    }

    this.rangeProfit = RangeProfit.MONTHLY;
    this.profitClicked = parseFloat(profit.toFixed(2));
    return this.profitClicked;
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

    this.rangeProfit = RangeProfit.YEARLY;
    this.profitClicked = parseFloat(profit.toFixed(2));
    return this.profitClicked;
  }
  
  showReceipt(receipt : Receipt) {
    this.openReceiptPopup.emit(receipt);
  }
}
