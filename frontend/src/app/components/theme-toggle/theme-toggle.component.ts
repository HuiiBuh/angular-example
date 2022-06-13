import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { translateTheme } from '../../helpers/theme';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private controlSubscription!: Subscription;

  constructor(
    private theme: ThemeService
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      theme: new FormControl(translateTheme(this.theme.theme))
    });
    this.controlSubscription = this.formGroup.get('theme')?.valueChanges.subscribe((value: boolean) => {
      this.theme.theme = translateTheme(value);
    })!;
  }

  public ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
  }
}
