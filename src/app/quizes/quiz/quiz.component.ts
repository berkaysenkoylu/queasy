import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz.model';
import { Question } from '../../questions/question.model';
import { HighscoreService } from 'src/app/highscore/highscore.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

enum Mode {
    showcase,
    quiz,
    finished
}

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css'],
    animations: [
        trigger('fadeIn', [
            state('notVisible', style({
                'visibility': 'hidden',
                'opacity': 0
            })),
            state('visible', style({
                'visibility': 'visible',
                'opacity': 1
            })),
            transition('notVisible => visible', animate(800))
        ])
    ]
})
export class QuizComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = ['username', 'score'];

    mode: Mode;
    quizId: string;
    quiz: Quiz;
    questionNumber: number;
    answers: boolean[];
    question: Question;
    chosenChoice: any;
    canSubmitAnswer: boolean = true;

    // defaultDuration: number;
    timeLeft: number = 60;
    quizInterval: any;
    quizFinishedTitle: string = '~ You have finished the quiz! ~';
    quizScorePercentage: number;
    quizNumberOfCorrectAnswers: number;
    answerFeedbackState: string = 'notVisible';
    quizFinishDivState: string = 'hidden';
    userList: any[];

    constructor(private quizService: QuizService, 
                private highscoreService: HighscoreService, 
                private authenticationService: AuthenticationService,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.mode = Mode.showcase;

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('quizId')){
                this.quizId = paramMap.get('quizId');
            }

            // Fetch the quiz from the database
            this.quizService.getOneQuiz(this.quizId).subscribe(quizData => {
                this.quiz = quizData.quiz;
            });

            // Fetch the corresponding highscores
            this.highscoreService.getHighscores(this.quizId).subscribe(highscoreData => {
                this.userList = highscoreData.highscore[0].scores;

                this.userList = this.userList.sort(function(user1, user2) {
                    return (user1.score > user2.score) ? -1 : ((user2.score > user1.score) ? 1 : 0);
                });
            });
        });
    }

    ngOnDestroy() {
        clearInterval(this.quizInterval);
    }

    startQuiz() {
        this.mode = Mode.quiz;
        this.initializeTimeLeft();
        this.questionNumber = 1;
        this.answers = new Array(this.quiz.questions.length);
        this.question = this.quiz.questions[this.questionNumber - 1];

        this.timer();
    }

    onCheckAnswer() {
        this.canSubmitAnswer = false;
        
        clearInterval(this.quizInterval);

        // Save the answer to an array
        this.answers[this.questionNumber - 1] = this.chosenChoice.isCorrect;

        // Answer feedback division fades in
        this.answerFeedbackState = 'visible';

        setTimeout(() => {
            this.onNextQuestion();
        }, 2000);
    }

    onNextQuestion() {
        this.answerFeedbackState = 'notVisible';

        this.questionNumber++;

        // Check if the quiz is finished!
        if (this.questionNumber > this.quiz.questions.length) {
            this.onQuizFinished();
        }

        // Resume the timer
        this.timer();

        // Reset the chosen choice
        this.canSubmitAnswer = true;
        this.chosenChoice = {};

        // Get and broadcast the next question
        this.question = this.quiz.questions[this.questionNumber - 1];
    }

    // If the timer runs out before user submits his answers
    quizTimeIsUp() {
        this.onQuizFinished(true);
    }

    onQuizFinished(isTimeUp: boolean = false) {
        // Check if the quiz is finished due to time running out
        if (isTimeUp) {
            this.quizFinishedTitle = '~ Time is up! ~';
        } else {
            this.quizFinishedTitle = '~ You have finished the quiz! ~';
        }

        // Set the mode to finished
        this.mode = Mode.finished;

        // Clear the interval
        clearInterval(this.quizInterval);

        // Show the answer to the user
        this.quizScorePercentage = this.getQuizResult() * 100;

        this.authenticationService.getUserName().subscribe(responseData => {
            // Send the result to highscores
            this.highscoreService.updateHighscores(this.quizId, responseData.username, this.getQuizResult() * 1000);
        });
    }

    getQuizResult() {
        let numberOfCorrect = 0;
        
        this.answers.forEach(answer => {
            if(answer === true){
                numberOfCorrect++;
            }
        });

        this.quizNumberOfCorrectAnswers = numberOfCorrect;

        return numberOfCorrect / this.answers.length;
    }

    initializeTimeLeft() {
        if(this.quiz){
            this.timeLeft = this.quiz.duration * 60;
        }
    }

    timer() {
        this.quizInterval = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.quizTimeIsUp();
            }
        }, 1000);
    }

    formatTimeLeft() {
        let min;
        let sec;
        let time: any;

        min = Math.floor(this.timeLeft / 60);
        sec = this.timeLeft % 60;
        
        if (min < 10) {
            min = `0${min}`;
        }

        if (sec < 10) {
            sec = `0${sec}`;
        }

        time = `${min}:${sec}`;

        return time;
    }
}