import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTodoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
