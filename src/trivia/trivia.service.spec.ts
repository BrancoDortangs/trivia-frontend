import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { TriviaService } from './trivia.service';
import { Answer, AnswerType } from './trivia.type';

describe('TriviaService', (): void => {
  let service: TriviaService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let loggerSpy: jasmine.SpyObj<Logger>;

  const baseUrl = 'http://localhost:8080';
  const sessionId = '9a445cd9-a790-4991-8bc6-d5c41a5239ad';
  const limit = 5;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['amountOfQuestions']);
    loggerSpy = jasmine.createSpyObj('Logger', ['logError']);

    settingsServiceSpy.amountOfQuestions.and.returnValue(limit);

    httpClientSpy.get.withArgs(`${baseUrl}/session`).and.returnValue(of({ sessionId: sessionId }));

    httpClientSpy.get
      .withArgs(`${baseUrl}/questions`, {
        params: {
          limit: limit,
          sessionId: sessionId,
        },
      })
      .and.returnValue(of([]));

    httpClientSpy.post.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        TriviaService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: SettingsService, useValue: settingsServiceSpy },
        { provide: Logger, useValue: loggerSpy },
      ],
    });

    service = TestBed.inject(TriviaService);
  });

  it('Should initialize session', (): void => {
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/session`);
  });

  it('Should get questions with sessionId and limit', (done): void => {
    service.getQuestions().subscribe({
      next: () => {
        expect(httpClientSpy.get).toHaveBeenCalledWith(`${baseUrl}/questions`, {
          params: { limit: limit, sessionId: sessionId },
        });
        done();
      },
      error: done.fail,
    });
  });

  it('Should check answers with sessionId', (done): void => {
    const answers: Answer<AnswerType>[] = [{ id: 'Question 1?', answer: 'Answer 1' }];
    service.checkAnswers(answers).subscribe({
      next: () => {
        expect(httpClientSpy.post).toHaveBeenCalledWith(`${baseUrl}/check-answers`, answers, {
          params: { sessionId: sessionId },
        });
        done();
      },
      error: done.fail,
    });
  });
});
