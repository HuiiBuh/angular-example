import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TodoStore } from '../../state/todo.state';

@Component({
  selector: 'app-tag-selection',
  templateUrl: './tag-selection.component.html',
  styleUrls: ['./tag-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagSelectionComponent implements OnInit {
  public formGroup: FormGroup;
  public tags$!: Observable<string[]>;

  constructor(
    private store: TodoStore,
    private formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.tags$ = this.store.onChanges('tags').pipe(
      tap((tagList: string[]) => {
        for (let tag of tagList) {
          if (!this.formGroup.get(tag)) {
            this.formGroup.addControl(tag, new FormControl(false));
          }
        }
      })
    );
    this.formGroup.valueChanges.subscribe(v => this.log(v));
  }

  public log($event: boolean): void {
    //console.log($event);
  }
}
