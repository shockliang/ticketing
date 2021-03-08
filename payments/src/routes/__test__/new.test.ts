import request from "supertest";
import mongoose from "mongoose";
import {app} from "../../app";
import {Order} from "../../models/order";
import {OrderStatus} from "@shockticketing/common";
import {stripe} from '../../stripe';

jest.mock('../../stripe');

it('return a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dalfjklsa;fj',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('return a 401 when purchasing an order that doesnt belong to user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 25,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dalfjklsa;fj',
            orderId: order.id
        })
        .expect(401);
});

it('return a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 25,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'dalfjklsa;fj',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 201 with valid input', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 25,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    const chargeOption = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOption.source).toEqual('tok_visa');
    expect(chargeOption.amount).toEqual(25 * 100);
    expect(chargeOption.currency).toEqual('usd');
});