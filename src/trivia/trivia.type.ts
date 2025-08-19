export type QuestionType = 'boolean' | 'multiple';

export type Question = {
  id: string;
  type: QuestionType;
  difficulty: string;
  category: string;
  question: string;
  answers: string[];
};

export type AnswerType = boolean | string;

export type Answer<Type extends AnswerType> = {
  id: string;
  answer: Type;
};

export type CorrectAnswer<Type extends AnswerType> = Answer<Type> & {
  id: string;
  answer: Type;
  correctAnswer: Type;
  isCorrect: boolean;
};
