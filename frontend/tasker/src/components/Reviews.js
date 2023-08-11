import React, {useContext, useEffect, useState} from 'react';
import ReviewCard from './ReviewCard.js';
import TaskerApi from '../api.js';
import { UserContext } from '../helpers/UserContext.js';

const Reviews = () => {

    const { user } = useContext(UserContext);

    const [reviews, setReviews] = useState([]);
    const [reviewCards, setReviewCards] = useState([]);
    const [toggleReviews, setToggleReviews] = useState(false);

    useEffect(() => {
        fetchAndSetReviews();
    }, []);


    useEffect(() => {

        if(reviews.length){
            setToggleReviews(true);
            createReviewCards();
        }
        
    }, [reviews]);


    const fetchAndSetReviews = async () => {
        try {
            const user_id = JSON.parse(user).id;
            const res = await TaskerApi.getAllReviewsForUser(user_id);
            const { reviews } = res;
            setReviews(reviews);
        } catch {
            return;
        };
    };


    const createReviewCards = () => {
        setReviewCards(reviews.map((review) => {
            return <ReviewCard review={review} key={review.id}/>
        }));
    };

    return (

        <div>
            <h1>Reviews</h1>
            <div>
                {toggleReviews && ([reviewCards])}
                {!toggleReviews && (<p>No reviews yet!</p>)}
            </div>
        </div>

    )
}

export default Reviews;