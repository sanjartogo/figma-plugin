import * as  React from "react";
//@ts-ignore
import Lottie from "lottie-react";
//@ts-ignore
import loading from './loading.json'

export default () => (
    <div className="loading-container">
        <div className="loading-content">
            <Lottie animationData={loading} loop={true} />
        </div>
            <p className="loading__title">Loading 4077 icons please wait...</p>
    </div>
)
