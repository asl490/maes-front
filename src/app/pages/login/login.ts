import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  showPassword = signal(false);
  showSplash = signal(false);
  serverError = signal('');

  form = inject(FormBuilder).group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    rememberMe: [false],
  });

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  get username() {
    return this.form.get('username')!;
  }
  get password() {
    return this.form.get('password')!;
  }

  fieldError(field: 'username' | 'password'): string {
    const control = this.form.get(field)!;
    if (!control.touched || control.valid) return '';
    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength')) return 'Password must be at least 6 characters.';
    return '';
  }

  togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.serverError.set('');
    this.showSplash.set(true);

    try {
      await firstValueFrom(
        this.auth.login(
          this.form.value.username!,
          this.form.value.password!,
          Boolean(this.form.value.rememberMe),
        ),
      );
      await this.router.navigate(['/app/dashboard']);
    } catch (error: unknown) {
      this.showSplash.set(false);
      this.serverError.set(this.authErrorMessage(error));
    }
  }

  private authErrorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
    }
    if (error.status === 0) return 'The authentication server is unavailable.';
    if (error.status === 400 || error.status === 401) return 'Invalid username or password.';

    const message =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? error.error.message
        : null;
    return typeof message === 'string' ? message : 'Unable to sign in. Please try again.';
  }
}
