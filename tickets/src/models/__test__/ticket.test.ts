import {Ticket} from "../ticket";

it('implements optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({
        title: 'my ticket',
        price: 25,
        userId: '1234'
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: '#1',
        price: 20,
        userId: '1234'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});