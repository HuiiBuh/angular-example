import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'rxjs-observable-store';
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
      account: null
    });

    const account = localStorage.getItem('user');
    if (account) this.patchState(JSON.parse(account), 'account');
  }

  public async login(username: string, password: string, rememberLogin: boolean): Promise<UserAccount> {
    const account = await this.todoApi.login(username, password).toPromise();
    this.patchState(account, 'account');
    if (rememberLogin) localStorage.setItem('user', JSON.stringify(account));
    return account;
  }

  public async fetchAccount(): Promise<UserAccount | null> {
    const account = await this.todoApi.getAccount().toPromise();
    this.patchState(account, 'account');
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
    this.patchState(todosToPatch, 'todo');
    return Object.values(this.state.todo);
  }

  public async fetchTodo(todoId: number): Promise<Todo> {
    const todo = await this.todoApi.getTodo(todoId).toPromise();
    let todosToPatch = this.state.todo;
    todosToPatch = {
      ...todosToPatch,
      [todo.id]: todo
    };
    this.patchState(todosToPatch, 'todo');
    return todo;
  }

  public async deleteTodo(todoId: number): Promise<null> {
    await this.todoApi.deleteTodo(todoId);
    const {[todoId]: value, ...newValue} = this.state.todo;
    this.patchState(newValue, 'todo');
    return null;
  }

  public async updateTodo(todoId: number, todo: Partial<PostTodo>): Promise<Todo> {
    const updatedTodo = await this.todoApi.updateTodo(todoId, todo).toPromise();
    const newValue = {
      ...this.state.todo,
      [todoId]: updatedTodo
    };
    this.patchState(newValue, 'todo');
    return updatedTodo;

  }

  public async createTodo(todo: PostTodo): Promise<Todo> {
    const newTodo = await this.todoApi.createTodo(todo).toPromise();
    const newValue = {
      ...this.state.todo,
      [newTodo.id]: newTodo
    };
    this.patchState(newValue, 'todo');
    return newTodo;
  }

  public async fetchTags(): Promise<string[]> {
    const tags = await this.todoApi.getTags().toPromise();
    this.patchState(tags, 'tags');
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

    this.patchState(todosToPatch, 'todo');
    return Object.values(this.state.todo).filter((t: Todo) => t.tags.includes(tagName));
  }

  public async createAccount(username: string, password: string): Promise<null> {
    return this.todoApi.createAccount(username, password).toPromise();
  }

  public async logout(): Promise<void> {
    this.patchState(null, 'account');
    localStorage.removeItem('user');
    await this.router.navigate(['/logout']);
  }
}
