export class HeartRateTraining {

    constructor(treadmillCommands) {
        this.trainingInterval = null;
        this.enableAdjustSpeed = false;
        this.enableAdjustIncline = false;
        this.heartRates = [];
        this.targetHeartRateMin = 0;
        this.targetHeartRateMax = 0;
        this.speedLimits = { min: 1.0, max: 20.0 };
        this.inclineLimits = { min: 0, max: 15 };
        this.treadmillCommands = treadmillCommands;
        this.currentSpeed = 0;
        this.currentIncline = 0;
        this.tolerance = 5;
        this.smallAdjustment = 0.2;
        this.largeAdjustment = 0.5;
        this.smallTimeout = 5000;
        this.largeTimeout = 10000;
    }

    handleHeartRateChanged(heartRate) {
        this.heartRates.push(heartRate);
        if (this.heartRates.length > 20) this.heartRates.shift();
    }

    calculateAverageHeartRate() {
        const sum = this.heartRates.reduce((a, b) => a + b, 0);
        return (sum / this.heartRates.length) || 0;
    }

    async adjustTreadmill() {
        if (!this.enableAdjustSpeed && !this.enableAdjustIncline) {
            return;
        }

        const averageHeartRate = this.calculateAverageHeartRate();
        if (averageHeartRate === 0) {
            // No heart rate data yet, try again later
            this.trainingInterval = setTimeout(this.adjustTreadmill.bind(this), this.smallTimeout);
            return;
        }

        const targetCenter = (this.targetHeartRateMin + this.targetHeartRateMax) / 2;
        let newSpeed = this.currentSpeed;
        let newIncline = this.currentIncline;
        let timeout = this.smallTimeout;

        // Determine if we need to increase or decrease intensity
        let needsIncrease = false;
        let needsDecrease = false;
        let isLargeAdjustment = false;

        if (averageHeartRate < this.targetHeartRateMin) {
            needsIncrease = true;
            if (averageHeartRate < this.targetHeartRateMin - this.tolerance) {
                isLargeAdjustment = true;
                timeout = this.largeTimeout;
            }
        } else if (averageHeartRate > this.targetHeartRateMax) {
            needsDecrease = true;
            if (averageHeartRate > this.targetHeartRateMax + this.tolerance) {
                isLargeAdjustment = true;
                timeout = this.largeTimeout;
            }
        }

        // Apply adjustments
        if (needsIncrease || needsDecrease) {
            const adjustment = isLargeAdjustment ? this.largeAdjustment : this.smallAdjustment;
            const multiplier = needsIncrease ? 1 : -1;

            // Prioritize speed adjustments, then incline
            if (this.enableAdjustSpeed) {
                newSpeed += adjustment * multiplier;
                newSpeed = Math.max(this.speedLimits.min, Math.min(newSpeed, this.speedLimits.max));
            } else if (this.enableAdjustIncline) {
                newIncline += (adjustment * 2) * multiplier; // Incline adjustments are typically larger
                newIncline = Math.max(this.inclineLimits.min, Math.min(newIncline, this.inclineLimits.max));
            }

            // Send commands to treadmill
            if (newSpeed !== this.currentSpeed && this.enableAdjustSpeed) {
                await this.treadmillCommands.setSpeed(newSpeed);
                this.currentSpeed = newSpeed;
            }

            if (newIncline !== this.currentIncline && this.enableAdjustIncline) {
                await this.treadmillCommands.setInclination(newIncline);
                this.currentIncline = newIncline;
            }
        }

        this.trainingInterval = setTimeout(this.adjustTreadmill.bind(this), timeout);
    }


    startHFTraining() {
        if (!this.trainingInterval) {
            this.trainingInterval = setTimeout(this.adjustTreadmill.bind(this), 0);
        }
    }

    stopHFTraining() {
        if (this.trainingInterval) {
            clearTimeout(this.trainingInterval);
            this.trainingInterval = null;
        }
    }

    setTargetHeartRateZone(min, max) {
        this.targetHeartRateMin = min;
        this.targetHeartRateMax = max;
    }

    setSpeedLimits(min, max) {
        this.speedLimits.min = min;
        this.speedLimits.max = max;
    }

    setInclineLimits(min, max) {
        this.inclineLimits.min = min;
        this.inclineLimits.max = max;
    }

    setAdjustmentMethods(adjustSpeed, adjustIncline) {
        this.enableAdjustSpeed = adjustSpeed;
        this.enableAdjustIncline = adjustIncline;
    }

    setCurrentSpeed(speed) {
        this.currentSpeed = speed;
    }

    setCurrentIncline(incline) {
        this.currentIncline = incline;
    }
}
