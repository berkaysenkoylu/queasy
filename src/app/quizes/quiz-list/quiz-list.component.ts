import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz.model';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit, OnDestroy {

    isUserAuthenticated: boolean = false;
    userId: string;

    isLoading: boolean = false;
    quizzes: Quiz[] = [];
    quizUpdatedSubscription: Subscription;

    constructor(private quizService: QuizService, private authenticationService: AuthenticationService) {}

    ngOnInit() {
        this.isLoading = true;
        this.quizService.getQuizzes();
        this.quizUpdatedSubscription = this.quizService.getQuizUpdateListener().subscribe(fetchedQuizzes => {
            this.quizzes = fetchedQuizzes;
            this.isLoading = false;
        });

        this.isUserAuthenticated = this.authenticationService.getIsAuthenticated();
        this.userId = this.authenticationService.getUserId();
        this.authenticationService.getAuthenticationStatusListener().subscribe(isAuthed => {
            this.isUserAuthenticated = isAuthed;
        });
    }

    ngOnDestroy() {
        this.quizUpdatedSubscription.unsubscribe();
    }

    onDelete(quizId: string) {
        this.quizService.deleteQuiz(quizId).subscribe(result => {
            this.quizService.getQuizzes();
        });
    }
}