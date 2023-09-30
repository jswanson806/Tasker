import React from "react";
import {ModalHeader, ModalBody, Button} from "reactstrap";
import "./styles/Confirmation.css"

const Confirmation = ({targetUserId, job, onConfirm, onClose}) => {

    const handleConfirmation = () => {
        onConfirm(job.id, targetUserId);
        onClose();
    }


    return (
        <div className="confirmation-container">
            <div className="confirmation-centered-card">
                <ModalHeader>Are you sure you want to assign this applicant to your job?</ModalHeader>
                <ModalBody>
                    <Button 
                        data-testid="confirmation-confirm-button" 
                        className="button" 
                        color="success" 
                        onClick={handleConfirmation}
                    >
                        Confirm
                    </Button>
                    <Button 
                        data-testid="confirmation-cancel-button" 
                        className="button" 
                        color="danger" 
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </ModalBody>
            </div>
        </div>
    )
};

export default Confirmation;