const bcrypt = require('bcrypt')

import mongoose,{Document} from 'mongoose'

import {Response} from "express-serve-static-core";
import {Request} from "express-serve-static-core";
import {NextFunction} from "express-serve-static-core";

import {ResponseHelper} from "../../Engine/index"
import {IsRequestValid} from "../../Engine/ErrorHandler/ErrorHandler"

import AdminUser, { IAdminUser } from '../Models/adminUser';

//jsonwebtoken
import  * as jwt from 'jsonwebtoken'


export function AdminAuthenticate(req:Request,res:Response,next:NextFunction) {
    const responseHelper = new ResponseHelper("Authenticate",res,req);
    const requestValid = IsRequestValid(responseHelper,req,"email","password");
   
    if(!requestValid)
        return;

    responseHelper.JsonRequest_Succeded()

    AdminUser.find({email: req.body.email})
    .exec()
    .then(function(user:IAdminUser[]){
        if(!UserFound(user)){
            return responseHelper.HTTP_Unauthorized("Authentication failed!");
        }

        bcrypt.compare(req.body.password,user[0].password,function(err:Error,result:boolean){
            var tempBool = CheckIfPasswordIsCorrect(err,result);

            if(tempBool){
                const jwtToken = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                },
                (String)(process.env.JWT_KEY),
                {
                    expiresIn: "100d"
                })
                return responseHelper.HTTP_OK_JSONResponse({
                    success: "Authentication Successfull!",
                    token : jwtToken
                });
            }else{
                return responseHelper.HTTP_Unauthorized("Authentication failed!");
            }
        })
    })
    .catch(function(err){
        return responseHelper.HTTP_InternalServerError(err);
    });

 } 


 function UserFound(user:IAdminUser[]) : boolean{
    if(user.length >= 1){return true;}
    else{ return false;}
 }

 function CheckIfPasswordIsCorrect(err:Error, result:boolean):boolean{
     if(err){
         return false;
     }

     return result;
 }