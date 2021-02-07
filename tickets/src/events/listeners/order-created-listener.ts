import {Message} from "node-nats-streaming";
import {Listener, OrderCreatedEvent, Subjects} from "@shockticketing/common";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({orderId: data.id});

        // Save the ticket
        await ticket.save();

        // Ack the message
        msg.ack();
    }
}