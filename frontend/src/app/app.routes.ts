import { Routes } from '@angular/router';
import { FixtureComponent } from './components/fixture/fixture';    

export const routes: Routes = [

    // Por defecto va a la Permier League
    {path: '', redirectTo: 'partidos/PL', pathMatch: 'full'},

    // Ruta para ver los partidos de una liga basandose en su codigo
    {path: 'partidos/:leagueCode', component: FixtureComponent},
];
