import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import type { Extensions } from '@tiptap/core';
import { EditorComponent } from 'ngx-tiptap-editor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { angularExtensions, extensions } from '../../helpers/extensions';
import { PostTodo, Todo } from '../../models/api-response.model';
import { TodoStore } from '../../state/todo.state';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTodoComponent implements OnInit {
  public extensions: Extensions = extensions;
  public angularExtensions = angularExtensions;
  public search = '';
  public filteredTags$: Observable<string[]> | undefined;
  public formGroup!: FormGroup;
  @ViewChild(EditorComponent) private editor!: EditorComponent;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public readonly context: TuiDialogContext<void | PostTodo, TodoComponent>,
    private store: TodoStore
  ) {
  }

  public ngOnInit(): void {
    let todo: Todo | null = null;
    if (this.context.data) {
      todo = this.context.data.todo;
    }


    this.formGroup = new FormGroup({
      heading: new FormControl(todo?.heading, Validators.required),
      image: new FormControl(todo?.imageUrl),
      tags: new FormControl(todo ? todo.tags : [])
    });
    this.filteredTags$ = this.store.on('tags').pipe(
      map(tags => tags.filter(tag => tag.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())))
    );
  }

  public cancel(): void {
    this.context.completeWith();
  }

  public submit(): void {
    this.context.completeWith({
      heading: this.formGroup.get('heading')!.value,
      imageUrl: this.formGroup.get('image')!.value,
      content: this.editor.editor!.getHTML(),
      tags: this.formGroup.get('tags')!.value,
    });
  }
}
