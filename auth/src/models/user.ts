import mongoose from 'mongoose';
import {Password} from "../services/password";

interface UserAttrs {
    email: string,
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs) : UserDoc
}

interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

const userSchema = new  mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ref) {
            ref.id = ref._id;
            delete ref._id;
            delete ref.__v;
            delete ref.password;
        }
    }
});

userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};