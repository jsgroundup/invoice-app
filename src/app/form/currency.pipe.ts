
// Pound currency pipe
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'poundCurrency',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: string|null): string {
    console.log(value);
    if(!value) value = ''; // Ensure value is not null
    // If value has non-numeric characters, remove them

    // Remove all non-numeric characters
    let amount:string|number = value.replace(/[^0-9\.]/g, ''); // example: 1234.56
    amount = Number(amount)
    console.log('Ammount', amount);

    return amount >= 0 ? `£ ${amount}` : '£ 0';
  }
}
