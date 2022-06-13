import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { TodoStore } from '../../state/todo.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public formControl!: FormGroup;
  public mode: 'login' | 'signup' = 'login';

  constructor(
    private store: TodoStore,
    @Inject(TuiNotificationsService) private readonly notificationsService: TuiNotificationsService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    const mode = this.router.parseUrl(this.router.url).queryParams.mode;
    if (mode === 'signup') {
      this.mode = 'signup';
    } else {
      this.mode = 'login';
    }


    this.formControl = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberLogin: new FormControl(false)
    });
  }

  public async login(): Promise<void> {
    const userPass = this.extractFormData();
    if (!userPass) return;

    const rememberLogin: boolean = this.formControl.get('rememberLogin')!.value;
    try {
      await this.store.login(userPass.username, userPass.password, rememberLogin);
      await this.router.navigate(['/']);
    } catch (e) {
      this.showError(e);
    }
  }


  public async signup(): Promise<void> {
    const userPass = this.extractFormData();
    if (!userPass) return;

    try {
      await this.store.createAccount(userPass.username, userPass.password);
      await this.router.navigate(['/login']);
      this.notificationsService.show('Successfully created Account', {
        status: TuiNotification.Success,
        hasCloseButton: false,
      }).subscribe();
      this.mode = 'login';
      this.formControl.get('username')?.setValue('');
      this.formControl.get('password')?.setValue('');
      this.formControl.markAsPristine();
      this.formControl.markAsUntouched();
    } catch (e) {
      this.showError(e);
    }
  }

  private extractFormData(): { username: string, password: string } | null {
    if (!this.formControl.valid) {
      this.formControl.markAllAsTouched();
      Object.values(this.formControl.controls).forEach(control => control.updateValueAndValidity());
      return null;
    }
    const username = this.formControl.get('username')!.value;
    const password = this.formControl.get('password')!.value;
    return {username, password};
  }

  private showError(e: any) {
    this.notificationsService.show(e.error.detail, {
      label: 'Something went wrong',
      status: TuiNotification.Error,
      hasCloseButton: false,
    }).subscribe();
  }

  public async enterHotkey(event: KeyboardEvent): Promise<void> {
    if(event.key !== "Enter") return event.stopPropagation();

    if (this.mode === 'login') {
      await this.login();
    } else {
      await this.signup();
    }

  }
}
