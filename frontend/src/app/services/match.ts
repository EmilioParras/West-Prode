import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que le dice a Angular cómo luce un "Partido"
// Debe coincidir con los campos del backend
export interface Match {
  id: number;
  apiMatchId: number;
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchDate: string;
  status: string;
  homeGoals?: number;
  awayGoals?: number;
}

@Injectable({
  providedIn: 'root',
})

export class Match {
  private apiUrl = 'http://localhost:3000/partidos';

  constructor(private http: HttpClient) { }

  // Método para obtener partidos por código de liga (ej: 'PL')
  getMatchesByLeague(code: string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/${code}`);
  }
}
