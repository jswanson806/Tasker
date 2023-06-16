"use strict";

function partialUpdate(data){

    const setCols = Object.keys(data).map((key, idx) => `${key} = $${idx + 1}`)

    return {
            setCols: setCols.join(", "),
            setVals: Object.values(data)
    };
}

module.exports = { partialUpdate };