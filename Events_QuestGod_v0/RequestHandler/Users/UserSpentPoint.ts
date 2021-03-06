import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express-serve-static-core';
import Transaction, {ITransaction} from '../../Models/transaction';
import Influencer_Product, {IInfluencer_Product} from '../../Models/influencer-product';
import User from '../../../Events_Authentication_v0/Models/user';

import {ResponseHelper} from '../../../Engine/index';
import Packet, { IPacket } from '../../Models/packet';

export function UserSpentPoint(req:Request, res:Response, next:NextFunction) {
    const responseHelper = new ResponseHelper("UserSpentpoint", res, req);

    const productId = req.body.productId;
    const userId = req.body.userData.userId;
    

    //find productId
    Influencer_Product
    .find({ _id: productId })
    .exec()
    .then( (product:any) => {
            // if product exist
            if (product.length >= 0) {
                //get ownerId(influencerId) from result
                const influencerId = product[0].ownerId;
            }

            else {
                return responseHelper.HTTP_UnprocessableEntity({ message: "product not exist"})
            }

            const productPrice = product[0].price;

            checkUserPoint(userId, productPrice);

            Transaction
            .find()
            .exec()
            .then( (transaction:any) => {
                const transactionModel = new Transaction({
                    _id: new mongoose.Types.ObjectId,
                    productId: productId,
                    userId: userId
                });
        
                transactionModel
                .save()
                .then( (result:any) => {
                    saveTransactionToInfluencerPacket(product[0].ownerId, transactionModel._id,req, responseHelper);
                })
            })
            .catch()
    })



    function saveTransactionToInfluencerPacket(influencerId:mongoose.Schema.Types.ObjectId, transactionId:mongoose.Schema.Types.ObjectId, req:Request, responseHelper:ResponseHelper){
        
        Packet
        .findOne({ "_id": influencerId })
        .exec()
        .then( (value:any) => {
            
            if (value === null) {
                return responseHelper.HTTP_UnprocessableEntity({ message: "influencer offline"});
            }
            else {
                var packetFound:IPacket;
                packetFound = value;

                packetFound.packet.push(transactionId);
                packetFound.save();

                waitingForStatus(transactionId);
            }
        })
    }

    async function waitingForStatus(transactionId: mongoose.Schema.Types.ObjectId) {

        let promise = new Promise( (resolve, reject) => {
            Transaction
            .find({ _id: transactionId })
            .exec()
            .then( (transaction) => {
                const status = transaction[0].status;

                if (!status) {
                    waitingForStatus(transactionId)
                }
                
                else if (status == 1){
                    resolve('done');
                    return responseHelper.HTTP_OK_JSONResponse({
                        message: "success"
                    });
                }

                else {
                    resolve('done');
                    return responseHelper.HTTP_UnprocessableEntity({
                        message: "failed"
                    });
                }
            })
        })
    }

    function checkUserPoint(userId: mongoose.Schema.Types.ObjectId, productPrice: Number) {
        User
        .find({ _id: userId })
        .exec()
        .then( (user) => {
            const userPoint = user[0].point;

            if (userPoint < productPrice) {
                return responseHelper.HTTP_UnprocessableEntity({
                    message: "point"
                })
            }
        })
    }
}