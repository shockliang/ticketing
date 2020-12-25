import {Publisher, Subjects, TicketCreatedEvent} from "@shockticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}