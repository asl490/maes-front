import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Splash } from '../../shared/splash/splash';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Splash],
  templateUrl: './login.html',
})
export class Login {
  showPassword = signal(false);
  showSplash   = signal(false);
  serverError  = signal('');

  form = inject(FormBuilder).group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  constructor(private auth: AuthService, private router: Router) {}

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  fieldError(field: 'email' | 'password'): string {
    const ctrl = this.form.get(field)!;
    if (!ctrl.touched || ctrl.valid) return '';
    if (ctrl.hasError('required'))  return 'This field is required.';
    if (ctrl.hasError('email'))     return 'Enter a valid email address.';
    if (ctrl.hasError('minlength')) return 'Password must be at least 6 characters.';
    return '';
  }

  togglePassword() { this.showPassword.update((v) => !v); }

  fillDemo() {
    this.form.setValue({ email: 'admin@nexadmin.com', password: 'admin123', rememberMe: false });
    this.serverError.set('');
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    // Mostrar splash inmediatamente
    this.serverError.set('');
    this.showSplash.set(true);

    await new Promise((r) => setTimeout(r, 1800));

    const ok = this.auth.login(this.form.value.email!, this.form.value.password!);

    if (ok) {
      this.router.navigate(['/app/dashboard']);
    } else {
      // Fallo — ocultar splash y mostrar error
      this.showSplash.set(false);
      this.serverError.set('Invalid email or password. Try admin@nexadmin.com / admin123');
    }
  }
}
