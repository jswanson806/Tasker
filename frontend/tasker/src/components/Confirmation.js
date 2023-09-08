import React from "react";

const Confirmation = ({targetUserId, job, onConfirm, onClose}) => {

    const handleConfirmation = () => {
        console.log(targetUserId)
        onConfirm(job.id, targetUserId);
        onClose();
    }


    return (
        <div>
            <h3>Assign user to job?</h3>
            <button onClick={handleConfirmation}>Confirm</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
};

export default Confirmation;