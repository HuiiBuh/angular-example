import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getThemeValue, storeThemeValue } from '../../helpers/theme';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private controlSubscription!: Subscription;

  ngOnInit(): void {
    const currentTheme = getThemeValue();
    this.formGroup = new FormGroup({
      theme: new FormControl(currentTheme)
    });
    this.controlSubscription = this.formGroup.get('theme')?.valueChanges.subscribe(storeThemeValue)!;
  }

  public ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
  }
}
