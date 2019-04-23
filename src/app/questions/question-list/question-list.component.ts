import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { QuestionsService } from '../questions.service';
import { Question } from '../question.model';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnDestroy {

    isUserAuthenticated: boolean;
    userId: string;

    isShowCorrectAnswers: false;
    questions: Question[] = [];
    
    private questionSubscription: Subscription;

    constructor(private questionsService: QuestionsService, private authenticationService: AuthenticationService) {}

    ngOnInit() {
        this.questionsService.getAllQuestions();
        this.questionSubscription = this.questionsService.getQuestionUpdateListener().subscribe((questionData: { questions: Question[] }) => {
            this.questions = questionData.questions;
        });

        this.isUserAuthenticated = this.authenticationService.getIsAuthenticated();
        this.userId = this.authenticationService.getUserId();
        this.authenticationService.getAuthenticationStatusListener().subscribe(isAuthed => {
            this.isUserAuthenticated = isAuthed;
        });
    }

    ngOnDestroy() {
        this.questionSubscription.unsubscribe();
    }

    onDelete(questionId: string) {
        this.questionsService.deleteQuestion(questionId).subscribe(result => {
            this.questionsService.getAllQuestions();
        });
    }
}