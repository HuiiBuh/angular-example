import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Todo } from '../../models/api-response.model';
import { TodoStore } from '../../state/todo.state';

@Component({
  selector: 'app-todo[todo]',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit, OnDestroy {
  private _todo!: Todo;
  public readonly control = new FormControl([]);
  public filteredTags$: Observable<string[]> | undefined;
  public search: string = '';
  private controlSubscription!: Subscription;

  constructor(
    private store: TodoStore
  ) {
  }

  @Input() set todo(value: Todo) {
    this._todo = value;
    this.control.setValue(value.tags);
  };

  get todo() {
    return this._todo;
  }

  public ngOnInit(): void {
    this.controlSubscription = this.control.valueChanges.subscribe(this.updateTagsForTodo.bind(this));
    this.filteredTags$ = this.store.onChanges('tags').pipe(
      map(tags => tags.filter(tag => tag.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())))
    );
  }

  public ngOnDestroy(): void {
    this.controlSubscription.unsubscribe();
  }

  private async updateTagsForTodo(tags: string[]) {
    await this.store.updateTodo(this.todo.id, {tags});
    await this.store.fetchTags();
  }
}
