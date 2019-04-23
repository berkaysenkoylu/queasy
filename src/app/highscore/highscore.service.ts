import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Highscore } from './highscore.model';

const BACKEND_URL = environment.apiUrl + '/highscore/';

@Injectable({
    providedIn: 'root'
})
export class HighscoreService implements OnInit, OnDestroy {

    constructor(private http: HttpClient) {}

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    createHighScore(id: string) {
        const highscore: Highscore = {
            quizId: id,
            scores: []
        }

        this.http.post<{ message: string, highscore: { quizId: string, scores: [] } }>(BACKEND_URL, highscore).subscribe(responseData => {
            // console.log(responseData);
        });
    }

    updateHighscores(id: string, username: string, newScore: number) {
        const score = {
            username: username,
            score: newScore
        };

        this.http.put(BACKEND_URL + id, score).subscribe(responseData => {
            // console.log(responseData);
        });
    }

    getHighscores(quizId: string) {
        return this.http.get<{ message: string, highscore: { username: string, score: number } }>(BACKEND_URL + quizId);
    }

    // The corresponding highscore structure needs to 
    // be gotten rid of, when the quiz is deleted
    onQuizDelete(quizId: string) {
        this.http.delete(BACKEND_URL + quizId).subscribe(response => {
            console.log(response);
        });
    }
}