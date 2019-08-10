declare class Timer {
    private startTime;
    private endTime;
    constructor();
    start(): void;
    end(): void;
    getProcessTime(precision?: number): string;
}
export default Timer;
