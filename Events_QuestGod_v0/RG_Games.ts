//const RequestGroup = require('../Utilities/RequestsGroup')
//const HTTPMethodType = require('../Utilities/HTTPMethodType').HTTPMethodType;

import {HTTPMethodType} from '../Engine_v0/index'
import {RequestGroup} from'../Engine_v0/BaseClass/RequestsGroup'

import {checkAuth} from '../Events_Authentication_v0/check-auth'
//Requests
import {CreateGame} from "./CreateGame"
//import {Authenticate} from "./Authenticate"

export class RG_Games extends RequestGroup
{
    private static instance:RG_Games;

    getInstance()
    {
        if(!RG_Games.instance){
            RG_Games.instance = new RG_Games("games");
        }

        return RG_Games.instance;
    }

    RegisterChildMethods()
    {
        console.log("Registering Child Methods in " + this.requestGroupPath)
        //this.RegisterRGChildMethod(HTTPMethodType.post,"creategame",CreateGame);
        //this.RegisterRGChildMethod(HTTPMethodType.post,"authenticate",Authenticate);
    }

    RegisterMiddlewares(){}
    RegisterRequestHandlers(){}
}