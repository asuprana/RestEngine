import mongoose, {Schema, Document} from 'mongoose'

export interface IInfluencer extends Document {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
    displayName: string,
    ipAddress: string,
    port: number,
    password: string,
    userType: string
}

let influencerSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    displayName: {type:String, required:true},
    ipAddress: {type:String, default: ''},
    port: {type:Number, default: ''},
    password: { type: String, required: true},
    userType: {type: String, required:true}
});

export default mongoose.model<IInfluencer>('Influencer', influencerSchema);