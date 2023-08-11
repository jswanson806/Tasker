"use strict";

function filterQuery(data){
    // if id was passed in data, delete it before mapping columns
    if(data.id) {
        delete data.id;
    }

    const matchers = Object.keys(data).map((key, idx) => `${key} = $${idx + 1}`)

    return {
            matchers: matchers.join(" AND "),
            setVals: Object.values(data)
    };
}

module.exports = { filterQuery };