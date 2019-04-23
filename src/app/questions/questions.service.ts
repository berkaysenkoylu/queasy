import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Question } from './question.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/questions/'

@Injectable({
    providedIn: "root"
})
export class QuestionsService {

    private questions: Question[] = [];
    private questionUpdated = new Subject<{ questions: Question[] }>();

    constructor(private http: HttpClient, private router: Router) {}

    addQuestion(form: FormGroup) {
        const newQuestion: Question = {
            id: null,
            question: form.value.question,
            choices: form.value.choices,
            author: null
        };

        this.http.post<{ message: string, question: {} }>(BACKEND_URL, newQuestion).subscribe(responseData => {
            this.router.navigate(['/']);
        });
    }

    updateQuestion(questionId: string, question: string, choices: []) {
        const updatedQuestion ={
            id: questionId,
            question: question,
            choices: choices
        };

        this.http.put(BACKEND_URL + questionId, updatedQuestion).subscribe(response => {
            this.router.navigate(['/']);
        });
    }

    getAllQuestions() {
        this.http.get<{ message: string, questions: any }>(BACKEND_URL).pipe(map((questionData) => {
            return {
                questions: questionData.questions.map(question => {
                    return {
                        id: question._id,
                        question: question.question,
                        choices: question.choices,
                        author: question.author
                    }
                })
            }
        })).subscribe((modifiedQuestionData) => {
            this.questions = modifiedQuestionData.questions;
            this.questionUpdated.next({ questions: [...this.questions] });
        });
    }

    getQuestion(questionId: string) {
        return this.http.get<{ _id: string, question: string, choices: [], author: string }>(BACKEND_URL + questionId);
    }

    deleteQuestion(questionId: string) {
        return this.http.delete(BACKEND_URL + questionId);
    }

    getQuestionUpdateListener() {
        return this.questionUpdated.asObservable();
    }
}