import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService, Match } from '../../services/match';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fixture-component',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css',
})

export class FixtureComponent implements OnInit {

  partidos: Match[] = [];
  selectedDate: Date = new Date();
  todayDate: Date = new Date();
  leagueCode: string = '';

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Establecer hora a medianoche para comparaciones más limpias
    this.todayDate.setHours(0, 0, 0, 0);
    this.selectedDate = new Date(this.todayDate);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueCode = params['leagueCode'];
      if (this.leagueCode) {
        this.cargarPartidos(this.leagueCode, this.selectedDate);
      }
    })
  }

  cargarPartidos(codigo: string, fecha: Date): void {
    // Convertir fecha a formato YYYY-MM-DD para enviar al backend
    const fechaFormateada = fecha.toISOString().split('T')[0];
    
    this.matchService.getMatchesByLeagueAndDate(codigo, fechaFormateada).subscribe({
      next: (data) => {
        this.partidos = data;
        console.log(`✅ Partidos recibidos para ${fechaFormateada}:`, this.partidos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al traer partidos:', err);
      }
    });
  }

  previousDay(): void {
    //Creo una fecha nueva para no modificar la original
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.cargarPartidos(this.leagueCode, this.selectedDate);
  }

  nextDay(): void {
    // Crear una nueva instancia de Date para no mutar la original
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.cargarPartidos(this.leagueCode, this.selectedDate);
  }

  isToday(): boolean {
    const selected = new Date(this.selectedDate);
    selected.setHours(0, 0, 0, 0);
    const today = new Date(this.todayDate);
    today.setHours(0, 0, 0, 0);
    return selected.getTime() === this.todayDate.getTime();
  }

}