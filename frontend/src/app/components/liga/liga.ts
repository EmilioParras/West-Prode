import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchService } from '../../services/match'; 

@Component({
  selector: 'liga-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './liga.html',
  styleUrl: './liga.css',
})

export class LigaComponent implements OnInit{
  ligas: any[] = [];
  loading = true;

  // Ligas disponibles con el plan FREE
  ligasPermitidas = ['PL', 'PD', 'BL1', 'SA', 'CL', 'DED', 'ELC', 'WC', 'BSA', 'PPL', 'EC', 'FL1'];

  constructor(
    private matchService: MatchService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
    this.matchService.getAvaibleLeagues().subscribe({
      next: (response) => {
        this.ligas = response.competitions.filter((c: any) => 
          this.ligasPermitidas.includes(c.code)
        ).map((c: any) => ({ ...c, matchesCount: null })); // inicializo matchesCount

        // Para cada liga pido el fixture de hoy y guardo el conteo
        this.ligas.forEach((liga) => {
          this.matchService.getMatchesByLeague(liga.code).subscribe({
            next: (data: any[]) => {
              liga.matchesCount = Array.isArray(data) ? data.length : 0;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error(`Error al traer partidos para ${liga.code}:`, err);
              liga.matchesCount = 0;
              this.cdr.detectChanges();
            }
          });
        });

        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.log('Error al cargar las ligas', err);
        this.loading = false;
      }
    })
  }
}
