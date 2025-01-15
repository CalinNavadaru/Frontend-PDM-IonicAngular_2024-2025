import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private navCtrl: NavController) { }

  async ngOnInit() {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    const authenticated = await this.auth.isAuthenticated();
    console.log(authenticated)
    if (authenticated) {
      this.navCtrl.navigateRoot("/list");
      return;
    }
    
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log('[Login] Username:', username);
      console.log('[Login] Password:', password);
      this.auth.login(this.loginUsername?.value, this.loginPassword?.value).subscribe({
        next: (response) => {
          console.log('[LOGIN] Logare reușită!', response);
          localStorage.setItem('jwtToken', response.access);
          localStorage.setItem('jwtToken_refresh', response.refresh);
          alert('[LOGIN] Logare reușită!');
          this.navCtrl.navigateRoot("/list");
        },
        error: (err) => {
          console.error('Eroare la înregistrare:', err);
          let errorMessage = 'A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.';
          if (err.status === 400) {
            errorMessage = 'Datele introduse sunt invalide. Verificați și încercați din nou.';
          } else if (err.status === 409) {
            errorMessage = 'Utilizatorul există deja. Încercați un alt nume de utilizator.';
          }
          this.showError(errorMessage); 
        }
      })
    }
  }
  showError(errorMessage: string) {
    alert(errorMessage);
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      const { username, password } = this.signUpForm.value;
      console.log('[Login] S Username:', username);
      console.log('[Login] S Password:', password);
      this.auth.register(this.signUpUsername?.value, this.signUpPassword?.value).subscribe({
        next: (response) => {
          console.log('[LOGIN] Înregistrare reușită!', response);
          localStorage.setItem('jwtToken', response.access);
          localStorage.setItem('jwtToken_refresh', response.refresh);
          alert('[LOGIN] Înregistrare reușită!');
          this.navCtrl.navigateRoot("/list");
        },
        error: (err) => {
          console.error('Eroare la înregistrare:', err);
          let errorMessage = 'A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.';
          if (err.status === 400) {
            errorMessage = 'Datele introduse sunt invalide. Verificați și încercați din nou.';
          } else if (err.status === 409) {
            errorMessage = 'Utilizatorul există deja. Încercați un alt nume de utilizator.';
          }
          this.showError(errorMessage); 
        }
      })
    }
  }

  get loginUsername() {
    return this.loginForm.get('username');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  get signUpUsername() {
    return this.signUpForm.get('username');
  }

  get signUpPassword() {
    return this.signUpForm.get('password');
  }
}
