import { Component, OnInit, ViewChildren } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { QuestionsService } from '../questions.service';
import { Question } from '../question.model';

@Component({
    selector: 'app-question-create',
    templateUrl: './question-create.component.html',
    styleUrls: ['./question-create.component.css']
})
export class QuestionCreateComponent implements OnInit {
    
    isCorrectAnswerSelected: boolean = false;

    // For editing the existing question
    private questionId: string;
    private mode = 'create';
    question: Question;
    defaultChoiceNumber: number = 4;

    @ViewChildren('trueButton') trueButtons: any;

    form: FormGroup;

    constructor(private questionsService: QuestionsService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.initNewQuestionForm();

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('questionId')) {
                this.mode = 'edit';
                this.isCorrectAnswerSelected = true;
                this.questionId = paramMap.get('questionId');

                // Get the single question with id
                this.questionsService.getQuestion(this.questionId).subscribe(questionData => {
                    this.question = {
                        id: questionData._id,
                        question: questionData.question,
                        choices: questionData.choices,
                        author: questionData.author
                    };

                    // Add extra choice fields if we have more than default number of choices (4 in this project)
                    if(this.question.choices.length > this.defaultChoiceNumber){
                        for (let index = 0; index < this.question.choices.length - this.defaultChoiceNumber; index++) {
                            this.onAddChoice();
                        }
                    }

                    // Setup the form and put the corresponding values on it
                    this.form.setValue({
                        'question': this.question.question,
                        'choices': this.question.choices
                    })
                });
            } else {
                this.mode = 'create';
                this.questionId = null;
            }
        });
    }

    private initNewQuestionForm() {
        this.form = new FormGroup({
            question: new FormControl(null, { validators: [Validators.required] }),
            choices: new FormArray([
                new FormGroup({
                    isCorrect: new FormControl(false, { validators: [] }),
                    choice: new FormControl(null, { validators: [Validators.required] })
                }),
                new FormGroup({
                    isCorrect: new FormControl(false, { validators: [] }),
                    choice: new FormControl(null, { validators: [Validators.required] })
                }),
                new FormGroup({
                    isCorrect: new FormControl(false, { validators: [] }),
                    choice: new FormControl(null, { validators: [Validators.required] })
                }),
                new FormGroup({
                    isCorrect: new FormControl(false, { validators: [] }),
                    choice: new FormControl(null, { validators: [Validators.required] })
                })
            ])
        });
    }

    onSubmit() {
        if(this.mode === 'create') {
            // Create mode
            this.questionsService.addQuestion(this.form);
        } else {
            // Edit mode
            this.questionsService.updateQuestion(this.questionId, this.form.value.question, this.form.value.choices);
        }
        
    }

    onAnswerToggleButtonClicked(index: number) {
        this.resetIsCorrect();

        this.isCorrectAnswerSelected = true;

        this.getControls()[index].get('isCorrect').setValue(true);        
    }

    getIsCorrect(index: number) {
        return this.getControls()[index].get('isCorrect').value;
    }

    resetIsCorrect() {
        this.getControls().forEach(element => {
            element.get('isCorrect').setValue(false);
        });
    }
    
    getControls() {
        return (<FormArray>this.form.get('choices')).controls;
    }

    onAddChoice() {
        (<FormArray>this.form.get('choices')).push(new FormGroup(
            {
                isCorrect: new FormControl(false, { validators: [] }),
                choice: new FormControl(null, { validators: [Validators.required] })
            }));
    }

    onDeleteOption(index: number) {
        (<FormArray>this.form.get('choices')).removeAt(index);
    }

    onCancelForm() {
        if (this.mode === 'edit') {
            this.router.navigate(['/', 'questions']);
        } else {
            this.router.navigate(['/']);
        }
    }

    onClearForm() {
        this.isCorrectAnswerSelected = false;
        this.form.reset();
    }
}