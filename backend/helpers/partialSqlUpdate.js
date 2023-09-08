"use strict";

function partialUpdate(data){
    // if id was passed in data, delete it before mapping columns
    if(data.id) {
        delete data.id;
    }

    if(data.applicants) {
        delete data.applicants;
    }

    if(!data.end_time) {
        data.end_time = null;
    }

    if(!data.start_time) {
        data.start_time = null;
    }

    const setCols = Object.keys(data).map((key, idx) => `${key} = $${idx + 1}`)

    return {
            setCols: setCols.join(", "),
            setVals: Object.values(data)
    };
}

module.exports = { partialUpdate };