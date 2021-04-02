export {
    presentationDir,
    fileName,
    sendToServer,
    fetchJSON
}



import {
    userAlert
} from './html'

import { MessageToServer} from './types';


import {
    manifest
} from './viewer'



//the directory where the slides are
function presentationDir() : string {
    return '.'
// return  'slides/' + (new URL(window.location.href)).searchParams.get('slides'); 
}


function getServer() {
    return 'http://localhost:3001';
}


//gives the name for a file in a slide, in the current presentation
//the slide parameter could be null, for top-level information in the presentation.
function fileName(slide: string, file: string): string {

    if (slide == null) {
        return presentationDir() + '/' + file;
    } else
        return presentationDir() + '/' + manifest.slideDict[slide] + '/' + file;
}

//send an object to the server
async function sendToServer(msg: MessageToServer): Promise < Response > {
    if (msg.type == 'slides' || msg.type == 'wav')
        msg.presentation = manifest.presentation;
    const json = JSON.stringify(msg);
    const response = await fetch(getServer(), {
        method: 'POST',
        body: json
    });
    if (!response.ok) {
        throw "not connected";
    } else
        return response;
}


//get a json file and parse it
async function fetchJSON(filename: string): Promise < unknown > {
    try {
        const res = await fetch(filename);
        if (!(res.ok))
            throw "not connected";

        else
            return res.json();
    } catch (e) {
        userAlert("Could not load slide file " + filename);
        return null;
    }
}
