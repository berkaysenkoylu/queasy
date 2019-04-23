import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Quiz } from './quiz.model';
import { environment } from '../../environments/environment';
import { HighscoreService } from '../highscore/highscore.service';

const BACKEND_URL = environment.apiUrl + '/quizzes/';

@Injectable({
    providedIn: 'root'
})
export class QuizService {

    newQuizCreated = new Subject<string>();

    quizzesUpdated = new Subject<Quiz[]>();
    quizzes: Quiz[] = [];

    constructor(private highscoreService: HighscoreService, private http: HttpClient, private router: Router) {}

    getQuizzes() {
        this.http.get<{ message: string, quizzes: any }>(BACKEND_URL).pipe(map((quizData) => {
            return {
                quizzes: quizData.quizzes.map(quiz => {
                    return {
                        id: quiz._id,
                        name: quiz.name,
                        description: quiz.description,
                        questions: quiz.questions,
                        author: quiz.author
                    }
                })
            }
        })).subscribe(transformedQuiz => {
            this.quizzes = transformedQuiz.quizzes;
            this.quizzesUpdated.next([...this.quizzes]);
        });
    }

    getOneQuiz(quizId: string) {
        return this.http.get<{ message: string, quiz: { id: string, name: string, description: string, questions: [], duration: number, author: string } }>(BACKEND_URL + quizId);
    }

    getQuizUpdateListener() {
        return this.quizzesUpdated.asObservable();
    }

    addNewQuiz(newQuiz: Quiz) {
        this.http.post<{ message: string, quiz: { id: string, name: string, description: string, questions: [], duration: number, author: string } }>(BACKEND_URL, newQuiz).subscribe(quizData => {
            // Passing this so that high score can listen to it and create a suitable data structure for it
            this.highscoreService.createHighScore(quizData.quiz.id);
            this.router.navigate(['/']);
        });
    }

    updateQuiz(newQuiz: Quiz) {
        this.http.put(BACKEND_URL + newQuiz.id, newQuiz).subscribe(response => {
            this.router.navigate(['/']);
        });
    }

    deleteQuiz(quizId: string) {
        // Highscore deletion will be handled here...
        this.highscoreService.onQuizDelete(quizId);
        
        return this.http.delete(BACKEND_URL + quizId);
    }

    getNewQuizCreationStatusListener() {
        return this.newQuizCreated.asObservable();
    }
}