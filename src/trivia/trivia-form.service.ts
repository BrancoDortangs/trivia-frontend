import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { TriviaService } from './trivia.service';
import { Answer, AnswerType, CorrectAnswer, Question } from './trivia.type';

@Injectable({ providedIn: 'root' })
export class TriviaForm {
  private readonly logger = inject(Logger);
  private readonly settingsService = inject(SettingsService);
  private readonly triviaService = inject(TriviaService);

  private readonly _questions = signal<Question[]>([]);
  readonly questions = computed<Question[]>(() => this._questions());

  private readonly _answerPerQuestionId = signal<Map<string, AnswerType>>(
    new Map<string, AnswerType>(),
  );
  readonly answerPerQuestionId = computed<Map<string, AnswerType>>(() =>
    this._answerPerQuestionId(),
  );

  private readonly _correctAnswerPerQuestionId = signal<Map<string, CorrectAnswer<AnswerType>>>(
    new Map<string, CorrectAnswer<AnswerType>>(),
  );
  readonly correctAnswerPerQuestionId = computed<Map<string, CorrectAnswer<AnswerType>>>(() =>
    this._correctAnswerPerQuestionId(),
  );

  constructor() {
    effect((): void => {
      const _amountOfQuestions = this.settingsService.amountOfQuestions();

      this.getNewQuestions();
    });
  }

  getNewQuestions(): void {
    this.triviaService
      .getQuestions()
      .pipe(take(1))
      .subscribe({
        next: (questions: Question[]): void => {
          this.changeQuestions(questions);
        },
        error: (error): void => {
          this.logger.logError(error);
        },
      });
  }

  changeQuestions(questions: Question[]): void {
    this.clearCorrectAnswers();

    this._questions.set(questions);

    this.initDefaultAnswers(questions);
  }

  private clearCorrectAnswers(): void {
    this._correctAnswerPerQuestionId.set(new Map<string, CorrectAnswer<AnswerType>>());
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

    this._answerPerQuestionId.set(answers);
  }

  changeAnswer(id: string, value: AnswerType): void {
    this._answerPerQuestionId.update((answerPerQuestionId) => answerPerQuestionId.set(id, value));
  }

  private getAnswers(): Answer<AnswerType>[] {
    return Array.from(this._answerPerQuestionId(), ([id, answer]) => ({
      id,
      answer,
    }));
  }

  checkAnswers(): void {
    this.triviaService
      .checkAnswers(this.getAnswers())
      .pipe(take(1))
      .subscribe({
        next: (correctAnswers: CorrectAnswer<AnswerType>[]): void => {
          const result = new Map<string, CorrectAnswer<AnswerType>>();

          correctAnswers.forEach((correctAnswer: CorrectAnswer<AnswerType>): void => {
            result.set(correctAnswer.id, { ...correctAnswer });
          });

          this._correctAnswerPerQuestionId.set(result);
        },
        error: (error): void => {
          this.logger.logError(error);
        },
      });
  }
}
