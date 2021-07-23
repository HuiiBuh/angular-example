import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getThemeString, ThemeType } from '../helpers/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme$: BehaviorSubject<ThemeType>;
  public theme$: Observable<ThemeType>;

  constructor() {
    this._theme$ = new BehaviorSubject(getThemeString());
    this.theme$ = this._theme$.asObservable();
  }

  public get theme(): ThemeType {
    return this._theme$.value;
  }

  public set theme(value: ThemeType) {
    this._theme$.next(value);
  }
}
