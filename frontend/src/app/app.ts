import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

//Mis componentes
import { FixtureComponent } from './components/fixture/fixture';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FixtureComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
