import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../services/match';
import { ActivatedRoute } from '@angular/router'; // Para que se pueda leer el parámetro de la ruta

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css',
})

export class FixtureComponent implements OnInit {
  partidos: Match[] = [];

  // Inyectamos el servicio en el constructor
  constructor(
    private matchService: Match,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const leagueCode = params['leagueCode']; // Obtenemos el código de la liga desde la URL
      if (leagueCode) {
        this.cargarPartidos(leagueCode);
      }
    })
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