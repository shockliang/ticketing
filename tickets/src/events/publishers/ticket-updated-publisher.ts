import {Publisher, Subjects, TicketUpdatedEvent} from "@shockticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}