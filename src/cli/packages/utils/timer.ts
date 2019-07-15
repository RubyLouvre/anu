class Timer {
    private startTime: [number, number];
    private endTime: [number, number];
    constructor() {
        this.startTime = process.hrtime();
    }
    start() {
        this.startTime = process.hrtime();
    }
    end() {
        this.endTime = process.hrtime(this.startTime);
    }
    getProcessTime(precision = 2) {
        const NS_PER_SEC = 1e9;
        if (!this.endTime) {
            throw new Error('Timer did not end.');
        }
        return (this.endTime[0] + this.endTime[1] / NS_PER_SEC).toFixed(precision);
    }
}
export default Timer;