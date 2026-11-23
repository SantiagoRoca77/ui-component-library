import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card } from 'ui-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly lastClick = signal('ninguno');

  protected onClick(origin: string): void {
    this.lastClick.set(origin);
  }
}
