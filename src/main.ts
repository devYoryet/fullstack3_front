import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { DashboardUserComponent } from './app/dashboard-user/dashboard-user.component';

import { AuthGuard } from './app/auth.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-dashboard', component: DashboardUserComponent }
    ]),
    provideAnimationsAsync()
  ],
});

//Usa "admin@example.com" para acceder al dashboard de administrador
//Usa cualquier otro email para acceder al dashboard de usuario