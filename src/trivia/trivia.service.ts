import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { Answer, AnswerType, CorrectAnswer, Question } from './trivia.type';

type Session = { sessionId: string };

@Injectable({ providedIn: 'root' })
export class TriviaService {
  private readonly httpClient = inject(HttpClient);
  private readonly logger = inject(Logger);
  private readonly settingsService = inject(SettingsService);

  private readonly apiUrl = 'http://localhost:8080';

  private sessionId$ = new ReplaySubject<string>(1);

  constructor() {
    this.initSession().subscribe({
      error: (error): void => {
        this.logger.logError(error);
      },
    });
  }

  private initSession(): Observable<Session> {
    return this.httpClient.get<Session>(this.apiUrl + '/session').pipe(
      tap((response) => {
        this.sessionId$.next(response.sessionId);
      }),
    );
  }

  getQuestions(): Observable<Question[]> {
    return this.sessionId$.pipe(
      switchMap((sessionId) =>
        this.httpClient.get<Question[]>(this.apiUrl + '/questions', {
          params: {
            limit: this.settingsService.amountOfQuestions(),
            sessionId,
          },
        }),
      ),
    );
  }

  checkAnswers(answers: Answer<AnswerType>[]): Observable<CorrectAnswer<AnswerType>[]> {
    return this.sessionId$.pipe(
      switchMap((sessionId) =>
        this.httpClient.post<CorrectAnswer<AnswerType>[]>(this.apiUrl + '/check-answers', answers, {
          params: { sessionId },
        }),
      ),
    );
  }
}
