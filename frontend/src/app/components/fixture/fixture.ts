import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor en el HTML
import { Match } from '../../services/match';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css',
})

export class FixtureComponent implements OnInit {
  // Aquí guardaremos los partidos que vengan del backend
  partidos: Match[] = [];

  // Inyectamos el servicio en el constructor
  constructor(private matchService: Match) {}

  ngOnInit(): void {
    // Al iniciar el componente, pedimos los partidos de la Premier League
    this.cargarPartidos('PL');
  }

  cargarPartidos(codigo: string): void {
    this.matchService.getMatchesByLeague(codigo).subscribe({
      next: (data) => {
        this.partidos = data;
        console.log('✅ Partidos recibidos en el Frontend:', this.partidos);
      },
      error: (err) => {
        console.error('❌ Error al traer partidos:', err);
      }
    });
  }

}