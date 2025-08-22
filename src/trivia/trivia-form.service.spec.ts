import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { TriviaForm } from './trivia-form.service';
import { TriviaService } from './trivia.service';
import { CorrectAnswer, Question } from './trivia.type';

describe('TriviaForm', (): void => {
  let triviaForm: TriviaForm;
  let triviaService: jasmine.SpyObj<TriviaService>;
  let logger: jasmine.SpyObj<Logger>;
  let settingsService: jasmine.SpyObj<SettingsService>;

  const booleanQuestion: Question = {
    id: '1',
    type: 'boolean',
    question: 'Question 1?',
    answers: ['False', 'True'],
    difficulty: 'Hard',
    category: 'General knowledge',
  };

  const multipleChoiceQuestion: Question = {
    id: '1',
    type: 'multiple',
    question: 'Question 1?',
    answers: ['1', '2'],
    difficulty: 'Hard',
    category: 'General knowledge',
  };

  beforeEach((): void => {
    const triviaServiceSpy = jasmine.createSpyObj('TriviaService', [
      'getQuestions',
      'checkAnswers',
    ]);
    const loggerSpy = jasmine.createSpyObj('Logger', ['logError']);
    const settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['amountOfQuestions']);

    TestBed.configureTestingModule({
      providers: [
        TriviaForm,
        { provide: TriviaService, useValue: triviaServiceSpy },
        { provide: Logger, useValue: loggerSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
      ],
    });

    triviaForm = TestBed.inject(TriviaForm);
    triviaService = TestBed.inject(TriviaService) as jasmine.SpyObj<TriviaService>;
    logger = TestBed.inject(Logger) as jasmine.SpyObj<Logger>;
    settingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
  });

  it('Should create new questions', (): void => {
    const mockQuestions: Question[] = [booleanQuestion];
    settingsService.amountOfQuestions.and.returnValue(1);
    triviaService.getQuestions.and.returnValue(of(mockQuestions));

    triviaForm.getNewQuestions();

    expect(triviaForm.questions()).toEqual(mockQuestions);
    expect(triviaForm.answerPerQuestionId().get('1')).toBe(false);
  });

  it('Should update answer', (): void => {
    const mockQuestions: Question[] = [booleanQuestion];
    triviaForm.changeQuestions(mockQuestions);

    triviaForm.changeAnswer('1', true);

    expect(triviaForm.answerPerQuestionId().get('1')).toBe(true);
  });

  it('Should set correct answers on check answers success', (): void => {
    const mockQuestions: Question[] = [multipleChoiceQuestion];
    triviaForm.changeQuestions(mockQuestions);

    const mockCorrectAnswers: CorrectAnswer<any>[] = [
      { id: '1', answer: '1', isCorrect: true, correctAnswer: '1' },
    ];
    triviaService.checkAnswers.and.returnValue(of(mockCorrectAnswers));

    triviaForm.checkAnswers();

    expect(triviaForm.correctAnswerPerQuestionId().get('1')?.isCorrect).toBe(true);
  });

  it('Should log error if get questions fails', (): void => {
    const error = new Error('Message');
    triviaService.getQuestions.and.returnValue(throwError(() => error));

    triviaForm.getNewQuestions();

    expect(logger.logError).toHaveBeenCalledWith(error);
  });

  it('Should log error if check answers fails', (): void => {
    const mockQuestions: Question[] = [booleanQuestion];
    triviaForm.changeQuestions(mockQuestions);

    const error = new Error('Message');
    triviaService.checkAnswers.and.returnValue(throwError(() => error));

    triviaForm.checkAnswers();

    expect(logger.logError).toHaveBeenCalledWith(error);
  });
});
