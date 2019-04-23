import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionCreateComponent } from './questions/question-create/question-create.component';
import { QuestionListComponent } from './questions/question-list/question-list.component';
import { QuizCreateComponent } from './quizes/quiz-create/quiz-create.component';
import { QuizListComponent } from './quizes/quiz-list/quiz-list.component';
import { QuizComponent } from './quizes/quiz/quiz.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthenticationGuard } from './authentication/authentication.guard';

const routes: Routes = [
  { path: 'new-question', component: QuestionCreateComponent, canActivate:[AuthenticationGuard] },
  { path: 'questions', component: QuestionListComponent },
  { path: 'questions/:questionId/edit', component: QuestionCreateComponent, canActivate:[AuthenticationGuard] },
  { path: 'new-quiz', component: QuizCreateComponent, canActivate:[AuthenticationGuard]  },
  { path: 'quizzes', component: QuizListComponent },
  { path: 'quizzes/:quizId/edit', component: QuizCreateComponent, canActivate:[AuthenticationGuard] },
  { path: 'quizzes/:quizId', component: QuizComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenticationGuard]
})
export class AppRoutingModule { }

// { path: 'edit/:questionId', component: QuestionCreateComponent }