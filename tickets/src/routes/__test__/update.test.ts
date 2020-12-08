import request from 'supertest';
import {app} from "../../app";
import mogoose from 'mongoose';

it('return a 404 if the provided id does not exit', async () => {
    const id = mogoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'my ticket',
            price: 20
        })
        .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
    const id = new mogoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'my ticket',
            price: 20
        })
        .expect(401);
});

it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'my ticket',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'my ticket sell 25',
            price: 25
        })
        .expect(401);
});

it('return a 400 if the user provides an invalid title or price', async () => {

});

it('updates the ticket provided valid inputs', async () => {

});
