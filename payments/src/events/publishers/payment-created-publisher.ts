import {Subjects, Publisher, PaymentCreatedEvent} from "@shockticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}