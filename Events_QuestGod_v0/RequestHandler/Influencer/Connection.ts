import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express-serve-static-core';

import Packet, {IPacket} from '../../Models/packet';
import {ResponseHelper} from '../../../Engine/index';
import Transaction, {ITransaction} from '../../Models/transaction';

export function InfluencerConnection(req:Request, res:Response, next:NextFunction) {
    const responseHelper = new ResponseHelper("Connection", res, req);
    responseHelper.JsonRequest_Succeded();
    
    const influencerId = req.body.userData.influencerId;

    Packet
    .find({ "_id": influencerId })
    .exec()
    .then((packet:any) => {
        console.log('packet', packet);

        if (packet.length >= 1) {
            waitingForPacket(influencerId)
        }

        else {

            const packetModel = new Packet({
                _id: influencerId
            });
    
            packetModel.save();

            waitingForPacket(influencerId);
            
        }
    })
    .catch( err => {
        console.log(err);
    });

    async function waitingForPacket(id:mongoose.Schema.Types.ObjectId) {
        let promise = new Promise( (resolve, reject) => {

            Packet
            .find({ _id: id })
            .exec()
            .then( (result) => {
                var packet = result[0].packet;
                console.log('test');
                console.log('packet result', result);

                if (packet.length < 1) {
                    waitingForPacket(id);
                } else {
                    //get some packet
                    
                    // console.log('packet result', result);
                    // console.log('packet result', result[0].packet);
                    const packet = result[0].packet;
                    const packetList = [];
                    console.log('this', packet);

                    for (var i = 0; i < packet.length; i++) {
                        packetList.push(packet[i]);
                    }

                    resolve('done');
                    return responseHelper.HTTP_OK_JSONResponse({
                        message: "success",
                        packetList
                    })
                }
            })
        })
    }
}
