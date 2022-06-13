import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from 'rx-observable-state';
import { map } from 'rxjs/operators';
import { PostTodo, Todo, UserAccount } from '../models/api-response.model';
import { TodoApiService } from '../services/todo-api.service';
import { TodoState } from './state.model';

@Injectable({providedIn: 'root'})
export class TodoStore extends Store<TodoState> {
  constructor(
    private todoApi: TodoApiService,
    private router: Router
  ) {
    super({
      todo: {},
      tags: [],
      account: null,
      filterTags: []
    });

    const account = localStorage.getItem('user');
    if (account) this.patch(JSON.parse(account), 'account');
  }

  public async login(username: string, password: string, rememberLogin: boolean): Promise<UserAccount> {
    const account = await this.todoApi.login(username, password).toPromise();
    this.patch(account, 'account');
    if (rememberLogin) localStorage.setItem('user', JSON.stringify(account));
    return account;
  }

  public async fetchAccount(): Promise<UserAccount | null> {
    const account = await this.todoApi.getAccount().toPromise();
    this.patch(account, 'account');
    return account;
  }

  public async fetchTodos(): Promise<Todo[]> {
    const todos = await this.todoApi.getTodos().toPromise();
    let todosToPatch = this.state.todo;
    for (let todo of todos) {
      todosToPatch = {
        ...todosToPatch,
        [todo.id]: todo
      };
    }
    this.patch(todosToPatch, 'todo');
    return Object.values(this.state.todo);
  }

  public async fetchTodo(todoId: number): Promise<Todo> {
    const todo = await this.todoApi.getTodo(todoId).toPromise();
    let todosToPatch = this.state.todo;
    todosToPatch = {
      ...todosToPatch,
      [todo.id]: todo
    };
    this.patch(todosToPatch, 'todo');
    return todo;
  }

  public async deleteTodo(todoId: number): Promise<null> {
    await this.todoApi.deleteTodo(todoId).toPromise();
    const {[todoId]: value, ...newValue} = this.state.todo;
    this.patch(newValue, 'todo');
    this.fetchTags();
    return null;
  }

  public async updateTodo(todoId: number, todo: Partial<PostTodo>): Promise<Todo> {
    const updatedTodo = await this.todoApi.updateTodo(todoId, todo).toPromise();
    const newValue = {
      ...this.state.todo,
      [todoId]: updatedTodo
    };
    this.patch(newValue, 'todo');
    return updatedTodo;

  }

  public async createTodo(todo: PostTodo): Promise<Todo> {
    const newTodo = await this.todoApi.createTodo(todo).toPromise();
    const newValue = {
      ...this.state.todo,
      [newTodo.id]: newTodo
    };
    this.patch(newValue, 'todo');
    this.patch(Array.from(new Set([...this.state.tags, ...newTodo.tags])), 'tags');
    return newTodo;
  }

  public async fetchTags(): Promise<string[]> {
    const tags = await this.todoApi.getTags().toPromise();
    this.patch(tags, 'tags');
    return this.state.tags;
  }

  public async getTaggedTodos(tagName: string): Promise<Todo[]> {
    const taggedTodos = await this.todoApi.getTaggedTodos(tagName).toPromise();
    let todosToPatch = this.state.todo;
    for (let todo of taggedTodos) {
      todosToPatch = {
        ...todosToPatch,
        [todo.id]: todo
      };
    }

    this.patch(todosToPatch, 'todo');
    return Object.values(this.state.todo).filter((t: Todo) => t.tags.includes(tagName));
  }

  public async createAccount(username: string, password: string): Promise<null> {
    return this.todoApi.createAccount(username, password).toPromise();
  }

  public async logout(): Promise<void> {
    this.setState({
      todo: {},
      tags: [],
      account: null,
      filterTags: []
    })
    localStorage.removeItem('user');
    await this.router.navigate(['/logout']);
  }

  public filterByTag(tags: Record<string, boolean>): void {
    const selectedTags = [];
    for (const tag of Object.keys(tags)) {
      if (tags[tag]) selectedTags.push(tag);
    }
    this.patch(selectedTags, 'filterTags');
  }

  public filteredTodos$(): Observable<Record<string, Todo>> {
    return this.state$.pipe(
      map(({filterTags, todo}) => {
        const todoList = Object.values(todo).filter(todo => todo.tags.some(i => filterTags.includes(i)));
        if (todoList.length === 0) return todo;
        return todoList.reduce((todoMap, todoItem) => {
          todoMap[todoItem.id] = todoItem;
          return todoMap;
        }, {} as Record<string, Todo>);
      })
    );
  }
}
