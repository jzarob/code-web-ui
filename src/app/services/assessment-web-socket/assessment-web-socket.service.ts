import { Observable } from 'rxjs/Rx';
import { ConnectEvent, AnswerQuestionEvent, EndAssessmentEvent } from './../../domains/events/web-socket-event';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { StompService } from 'ng2-stomp-service';
import { Injectable } from '@angular/core';
import { NewQuestionEvent, PasteEvent } from 'app/domains/events/web-socket-event';

@Injectable()
export class AssessmentWebSocketService {

  socketUrl = '/api/v1/socket';

  constructor(public stomp: StompService) {
    stomp.configure({
      host: this.socketUrl,
      debug: true,
      queue: { 'init': false }
    });

    stomp.startConnect().then(() => {
      stomp.done('init');
    });
  }

  sendConnectEvent(guid: string) {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/connect`, new ConnectEvent());
    });
  }

  getConnectEvent(guid: string): Observable<ConnectEvent> {
    const connect: Subject<ConnectEvent> = new Subject<ConnectEvent>();
    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/connect`, (data) => {
        connect.next(data);
      });
    });
    return connect;
  }

  getNewQuestion(guid: string): Observable<NewQuestionEvent> {
    const newQuestion: Subject<NewQuestionEvent> = new Subject<NewQuestionEvent>();
    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/new-question`, (data) => {
        newQuestion.next(data);
      });
    });
    return newQuestion;
  }

  sendNewQuestion(guid: string, question: NewQuestionEvent): void {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/new-question`, question);
    });
  }

  answerQuestion(guid: string, answerQuestion: AnswerQuestionEvent): void {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/answer-question`, answerQuestion);
    });
  }

  getAnsweredQuestion(guid: string): Observable<AnswerQuestionEvent> {
    const answeredQuestion: Subject<AnswerQuestionEvent> = new Subject<AnswerQuestionEvent>();

    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/answer-question`, (data) => {
        answeredQuestion.next(data);
      });
    });

    return answeredQuestion;
  }

  sendEndAssessment(guid: string, event: EndAssessmentEvent) {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/end-assessment`, event);
    });
  }

  getEndAssessment(guid: string): Subject<EndAssessmentEvent> {
    const assessmentEndedEvent: Subject<EndAssessmentEvent> = new Subject<EndAssessmentEvent>();

    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/end-assessment`, (event) => {
        assessmentEndedEvent.next(event);
      });
    });

    return assessmentEndedEvent;
  }

  sendPasteEvent(guid: string) {
    this.stomp.after('init').then(() => {
      this.stomp.send(`/assessment/${guid}/paste`, new PasteEvent());
    });
  }

  getPasteEvent(guid: string): Observable<PasteEvent> {
    const paste: Subject<PasteEvent> = new Subject<PasteEvent>();
    this.stomp.after('init').then(() => {
      this.stomp.subscribe(`/topic/assessment/${guid}/paste`, (data) => {
        paste.next(data);
      });
    });
    return paste;
  }

}
