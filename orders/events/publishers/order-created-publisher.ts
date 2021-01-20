import {Publisher, OrderCreatedEvent, Subjects} from "@shockticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;

}