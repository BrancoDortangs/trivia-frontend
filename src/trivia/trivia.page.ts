import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';
import { ToggleButton } from 'primeng/togglebutton';
import { take } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { TriviaService } from './trivia.service';
import { Answer, AnswerType, CorrectAnswer, Question } from './trivia.type';

@Component({
  selector: 'app-trivia',
  imports: [
    InputNumberModule,
    CommonModule,
    FormsModule,
    FloatLabelModule,
    Button,
    ToggleButton,
    Divider,
    RadioButton,
  ],
  templateUrl: './trivia.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaPage implements OnInit {
  readonly triviaService = inject(TriviaService);

  private readonly logger = inject(Logger);

  readonly questions = signal<Question[]>([]);

  readonly answerPerQuestionId = signal<Map<string, AnswerType>>(new Map<string, AnswerType>());

  readonly correctAnswerPerQuestionId = signal<Map<string, CorrectAnswer<AnswerType>>>(
    new Map<string, CorrectAnswer<AnswerType>>(),
  );

  changeAnswer(id: string, value: AnswerType): void {
    this.answerPerQuestionId.update((answerPerQuestionId) => answerPerQuestionId.set(id, value));
  }

  ngOnInit(): void {
    this.getNewQuestions();
  }

  getNewQuestions(): void {
    this.triviaService
      .getQuestions()
      .pipe(take(1))
      .subscribe({
        next: (questions: Question[]): void => {
          this.questions.set(questions);

          this.initDefaultAnswers(questions);
        },
        error: (error): void => {
          this.logger.logError(error);
        },
      });
  }

  private initDefaultAnswers(questions: Question[]): void {
    const answers = new Map<string, AnswerType>();

    questions.forEach((question: Question): void => {
      if (question.type === 'boolean') {
        answers.set(question.id, false);
      } else {
        answers.set(question.id, '');
      }
    });

    this.answerPerQuestionId.set(answers);
  }

  onSubmit(): void {
    const answers: Answer<AnswerType>[] = Array.from(
      this.answerPerQuestionId(),
      ([id, answer]) => ({
        id,
        answer,
      }),
    );

    this.triviaService
      .checkAnswers(answers)
      .pipe(take(1))
      .subscribe({
        next: (correctAnswers: CorrectAnswer<AnswerType>[]): void => {
          const result = new Map<string, CorrectAnswer<AnswerType>>();

          correctAnswers.forEach((correctAnswer: CorrectAnswer<AnswerType>): void => {
            result.set(correctAnswer.id, { ...correctAnswer });
          });

          this.correctAnswerPerQuestionId.set(result);
        },
        error: (error): void => {
          this.logger.logError(error);
        },
      });
  }
}
