import React, {useEffect, useState} from 'react';

const ReviewCard = ({review}) => {

    return (
        <div>
            <h1>{review.title}</h1>
            <h3>{review.stars}</h3>
            <p>{review.body}</p>
        </div>
    )

}

export default ReviewCard;