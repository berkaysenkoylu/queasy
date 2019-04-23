import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { QuestionsService } from '../../questions/questions.service';
import { Question } from '../../questions/question.model';
import { Quiz } from '../quiz.model';
import { QuizService } from '../quiz.service';

@Component({
    selector: 'app-quiz-create',
    templateUrl: './quiz-create.component.html',
    styleUrls: ['./quiz-create.component.css']
})
export class QuizCreateComponent implements OnInit, OnDestroy {

    // For editing the quiz
    mode: string = 'create';
    quizId: string;
    quiz: Quiz;

    // Arrays for questions to submit as quiz questions
    availableQuestions: Question[] = [];
    quizQuestions: Question[] = [];
    // Vars for preview question
    isPreviewOn: boolean = false;
    previewQuestion: any;
    isShowCorrectAnswer: boolean = false;
    // Form for quiz misc data
    form: FormGroup;

    private questionSubscription: Subscription;

    constructor(private questionsService: QuestionsService, private quizService: QuizService, private route: ActivatedRoute) {}

    ngOnInit() {
        // Get the available questions from the backend
        this.questionsService.getAllQuestions();
        this.questionSubscription = this.questionsService.getQuestionUpdateListener().subscribe((questionData: { questions: Question[] }) => {
            this.availableQuestions = questionData.questions;
        });

        // Create the form
        this.form = new FormGroup({
            'name': new FormControl(null, { validators: [Validators.required, Validators.minLength(10)] }),
            'description': new FormControl(null, { validators: [Validators.required] }),
            'duration': new FormControl(null, { validators: [Validators.required] })
        });

        // Check the mode
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('quizId')) {
                this.mode = 'edit';
                this.quizId = paramMap.get('quizId');

                // Get the single quiz with the id
                this.quizService.getOneQuiz(this.quizId).subscribe(fetchedQuiz => {
                    this.quiz = fetchedQuiz.quiz

                    // Pre-populate the form
                    this.form.setValue({ 'name': this.quiz.name, 'description': this.quiz.description, 'duration': this.quiz.duration });

                    // Pre-populate the arrays
                    this.quiz.questions.forEach(question => {
                        this.onExchangeQuestion(question.id, true);
                    });
                });
            } else {
                this.mode = 'create';
                this.quizId = null;
                this.quiz = null;
            }
        }); 
    }

    ngOnDestroy() {
        this.questionSubscription.unsubscribe();
    }

    onExchangeQuestion(questionId: string, toQuiz: boolean) {
        let selectedQuestion;
        let index;

        if(toQuiz) {
            selectedQuestion = this.availableQuestions.find(question => question.id === questionId);
            index = this.availableQuestions.indexOf(selectedQuestion);

            this.availableQuestions.splice(index, 1);
            this.quizQuestions.push(selectedQuestion);
        } else {
            selectedQuestion = this.quizQuestions.find(question => question.id === questionId);
            index = this.quizQuestions.indexOf(selectedQuestion);

            this.quizQuestions.splice(index, 1);
            this.availableQuestions.push(selectedQuestion);
        }
    }

    onViewQuestion(questionText: string, questionChoices: []) {
        this.isPreviewOn = true;

        if(!this.isPreviewOn) {
            this.previewQuestion = null;
            return;
        }

        this.previewQuestion = {
            question: questionText,
            choices: questionChoices
        };
    }

    closeQuestionPreview() {
        this.isPreviewOn = false;
    }

    onCreateQuiz() {
        let createdQuiz: Quiz;

        createdQuiz = {
            id: null,
            name: this.form.value.name,
            description: this.form.value.description,
            questions: this.quizQuestions,
            duration: this.form.value.duration,
            author: null
        };

        if (this.mode === 'create') {
            // Create mode
            if (this.form.valid && this.quizQuestions.length > 0) {
                this.quizService.addNewQuiz(createdQuiz);
            } else {
                console.log("Invalid quiz, please try again, and harder this time!");
            }
        } else {
            // Edit mode
            createdQuiz.id = this.quizId;
            this.quizService.updateQuiz(createdQuiz);
        }
    }
}