import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card, Select, SelectOptions } from 'ui-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Select],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly lastClick = signal('ninguno');

  protected readonly resourceOptions: SelectOptions[] = [
    {label: 'Characters', value: 'character'},
    {label: 'Episodes', value:'episode'},
    {label: 'Locations', value: 'location'},
  ];
  protected readonly resource = signal<string | null>(null);

  protected onClick(origin: string): void {
    this.lastClick.set(origin);
  }
}
