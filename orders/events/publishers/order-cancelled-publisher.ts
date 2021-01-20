import {Publisher, Subjects, OrderCancelledEvent} from "@shockticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}