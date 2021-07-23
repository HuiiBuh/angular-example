import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiModeModule, TuiNotificationsModule,
  TuiRootModule, TuiScrollbarModule, TuiSvgModule, TuiTextfieldControllerModule,
  TuiThemeNightModule
} from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiBadgeModule, TuiCheckboxLabeledModule, TuiDataListWrapperModule, TuiInputModule, TuiInputPasswordModule,
  TuiInputTagModule,
  TuiMarkerIconModule,
  TuiToggleModule
} from '@taiga-ui/kit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTodoComponent } from './components/create-todo/create-todo.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { HeaderComponent } from './components/header/header.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { CardComponent } from './components/card/card.component';
import { FabComponent } from './components/fab/fab.component';
import { TagSelectionComponent } from './components/tag-selection/tag-selection.component';
import { HomeComponent } from './components/home-component/home.component';
import { LoginComponent } from './components/login/login.component';
import { AUTH_INTERCEPTOR_PROVIDER, AUTH_ERROR_PROVIDER } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CreateTodoComponent,
    TodoComponent,
    TodoListComponent,
    HeaderComponent,
    ThemeToggleComponent,
    CardComponent,
    FabComponent,
    TagSelectionComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    TuiNotificationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TuiRootModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDataListModule,
    TuiAvatarModule,
    TuiSvgModule,
    TuiMarkerIconModule,
    TuiBadgeModule,
    TuiInputTagModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiCheckboxLabeledModule,
    TuiScrollbarModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiButtonModule
  ],
  providers: [
    AUTH_INTERCEPTOR_PROVIDER,
    AUTH_ERROR_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
