import { Injectable } from '@angular/core';

@Injectable()
export class DatesService {

    constructor() {
    }

    async setInvalidDates(response: any) {
        var invalidDates : Array<Date>= [];
        response.forEach(element => {
            var dates = this.getDatesInARange(element.fromDate, element.toDate);
            dates.forEach(d => {
                invalidDates.push(d);
            });
        });
        return invalidDates;
    }

    getDatesInARange(start: Date, end: Date) {
        var resultAry = new Array(), arr = new Array(), dt = new Date(start), et = new Date(end);
        while (dt <= et) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        arr.forEach(value => {
            var tomorrow = new Date();
            tomorrow.setMonth(value.getMonth());
            tomorrow.setDate(value.getDate() + 1);
            tomorrow.setFullYear(value.getFullYear());
            resultAry.push(tomorrow);
        })
        return resultAry;
    }

    getDatesInARangeOnUI(start: Date, end: Date) {
        var arr = new Array(), dt = new Date(start), et = new Date(end);
        while (dt <= et) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    inValidDateSelected(totalDates: any[], invalidDates: Array<Date>) {
        totalDates.sort;
        invalidDates.sort;
        var result = totalDates.filter(o => invalidDates.some((date) => o.date == date));
        var status = result.length > 0 ? true : false;
        return status;
    }
}