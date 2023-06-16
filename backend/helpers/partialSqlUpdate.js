"use strict";

function partialUpdate(data){
    console.log(data)
    const setCols = Object.keys(data).map((key, idx) => `${key} = $${idx + 1}`)
    
    console.log(setCols)
    return {
            setCols: setCols.join(", "),
            setVals: Object.values(data)
    };
}

module.exports = { partialUpdate };