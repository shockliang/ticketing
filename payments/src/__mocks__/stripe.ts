export const stripe = {
    charges: {
        create: jest
            .fn()
            .mockResolvedValue({id: 'ch_1FbqYOEmju1XZH6lENIvQXrc'})
    }
}