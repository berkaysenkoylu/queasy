import { Question } from '../questions/question.model';

export interface Quiz {
    id: string,
    name: string,
    description: String,
    questions: Question[],
    duration: number,
    author: string
}