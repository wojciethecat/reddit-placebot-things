canvas = {}

function getCanvas(){
    ws = new WebSocket("wss://gql-realtime-2.reddit.com/query")
    stage = 0
    token = "xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" //it seems like it doesn't even do anything! we can get the image without even token, just put 44 char long shit.

    ws.onopen = function () {
        stageOne()
    }
    ws.onmessage = function (event) {
        if (JSON.parse(event.data).type == "connection_ack") {
            stageTwo()
        }
        try{
            if (typeof JSON.parse(event.data).payload.data.subscribe.data.colorPalette !== 'undefined') {
                stageThree()
            }
        }catch(e){}
        if(stage == 3){
            try{
                if (typeof JSON.parse(event.data).payload.data.subscribe.data.__typename !== 'undefined') {
                    if(JSON.parse(event.data).payload.data.subscribe.data.__typename == "FullFrameMessageData"){
                        console.log("received the img: "+JSON.parse(event.data).payload.data.subscribe.data.name)
                        if(String(JSON.parse(event.data).payload.data.subscribe.data.name).includes("-0-f-")){
                            canvas["0"] = JSON.parse(event.data).payload.data.subscribe.data.name
                        }else if(String(JSON.parse(event.data).payload.data.subscribe.data.name).includes("-1-f-")){
                            canvas["1"] = JSON.parse(event.data).payload.data.subscribe.data.name
                        }else if(String(JSON.parse(event.data).payload.data.subscribe.data.name).includes("-2-f-")){
                            canvas["2"] = JSON.parse(event.data).payload.data.subscribe.data.name
                        }else if(String(JSON.parse(event.data).payload.data.subscribe.data.name).includes("-3-f-")){
                            canvas["3"] = JSON.parse(event.data).payload.data.subscribe.data.name
                        }
                    }
                }
            }catch(e){
                
            }
        }
    }





    function stageOne() {//init
        ws.send(
            JSON.stringify(
                {
                    "type": "connection_init",
                    "payload": { "Authorization": "Bearer " + token },
                }
            )
        )
        stage = 1
    }
    function stageTwo() {//config data
        ws.send(
            JSON.stringify(
                {
                    "id": "1",
                    "type": "start",
                    "payload": {
                        "variables": {
                            "input": {
                                "channel": {
                                    "teamOwner": "AFD2022",
                                    "category": "CONFIG",
                                }
                            }
                        },
                        "extensions": {},
                        "operationName": "configuration",
                        "query": "subscription configuration($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on ConfigurationMessageData {\n          colorPalette {\n            colors {\n              hex\n              index\n              __typename\n            }\n            __typename\n          }\n          canvasConfigurations {\n            index\n            dx\n            dy\n            __typename\n          }\n          canvasWidth\n          canvasHeight\n          __typename\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
                    },
                }
            )
        )
        stage = 2
    }

    function stageThree() {
        ws.send(JSON.stringify({"id":"2","type":"start","payload":{"variables":{"input":{"channel":{"teamOwner":"AFD2022","category":"CANVAS","tag":"0"}}},"extensions":{},"operationName":"replace","query":"subscription replace($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n        ... on DiffFrameMessageData {\n          __typename\n          name\n          currentTimestamp\n          previousTimestamp\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}},))
        ws.send(JSON.stringify({"id":"3","type":"start","payload":{"variables":{"input":{"channel":{"teamOwner":"AFD2022","category":"CANVAS","tag":"1"}}},"extensions":{},"operationName":"replace","query":"subscription replace($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n        ... on DiffFrameMessageData {\n          __typename\n          name\n          currentTimestamp\n          previousTimestamp\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}}))
        ws.send(JSON.stringify({"id":"4","type":"start","payload":{"variables":{"input":{"channel":{"teamOwner":"AFD2022","category":"CANVAS","tag":"2"}}},"extensions":{},"operationName":"replace","query":"subscription replace($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n        ... on DiffFrameMessageData {\n          __typename\n          name\n          currentTimestamp\n          previousTimestamp\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}}))
        ws.send(JSON.stringify({"id":"5","type":"start","payload":{"variables":{"input":{"channel":{"teamOwner":"AFD2022","category":"CANVAS","tag":"3"}}},"extensions":{},"operationName":"replace","query":"subscription replace($input: SubscribeInput!) {\n  subscribe(input: $input) {\n    id\n    ... on BasicMessage {\n      data {\n        __typename\n        ... on FullFrameMessageData {\n          __typename\n          name\n          timestamp\n        }\n        ... on DiffFrameMessageData {\n          __typename\n          name\n          currentTimestamp\n          previousTimestamp\n        }\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}}))
    
        stage = 3
    }
}