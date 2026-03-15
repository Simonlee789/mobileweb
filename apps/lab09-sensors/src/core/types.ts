export interface MotionSample {
    x: number
    y: number
    z: number
    timestamp: number
}

export interface WorkoutStats {
    repsTotal: number
    repsOk: number
    repsBad: number
    score: number
    lastMessage: string
}

export interface WorkoutState {
    status: 'IDLE' | 'RUNNING' | 'STOP'
    repDisplay: number
    stats: WorkoutStats
}