import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HeaderComponent } from './header/header.component';
import { QuestionCreateComponent } from './questions/question-create/question-create.component';
import { QuestionListComponent } from './questions/question-list/question-list.component';
import { QuizCreateComponent } from './quizes/quiz-create/quiz-create.component';
import { QuizListComponent } from './quizes/quiz-list/quiz-list.component';
import { QuizComponent } from './quizes/quiz/quiz.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationInterceptor } from './authentication/authentication.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    QuestionCreateComponent,
    QuestionListComponent,
    QuizCreateComponent,
    QuizListComponent,
    QuizComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [{ provide:HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
              { provide:HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
