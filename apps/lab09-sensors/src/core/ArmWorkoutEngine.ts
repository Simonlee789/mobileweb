import type { MotionSample, WorkoutState } from './types'

export class ArmWorkoutEngine {

    state: WorkoutState
    callback: any = null

    lastTrigger = 0

    constructor() {

        this.state = {
            status: 'IDLE',
            repDisplay: 0,
            stats: {
                repsTotal: 0,
                repsOk: 0,
                repsBad: 0,
                score: 0,
                lastMessage: 'Ready'
            }
        }

    }

    onChange(cb: (s: WorkoutState) => void) {
        this.callback = cb
        cb(this.state)
    }

    emit() {
        if (this.callback) this.callback({ ...this.state })
    }

    start() {
        this.state.status = 'RUNNING'
        this.state.repDisplay = 0
        this.state.stats = {
            repsTotal: 0,
            repsOk: 0,
            repsBad: 0,
            score: 0,
            lastMessage: 'Ready'
        }
        this.emit()
    }

    stop() {
        this.state.status = 'STOP'
        this.emit()
    }

    process(sample: MotionSample) {

        if (this.state.status !== 'RUNNING') return

        const force =
            Math.abs(sample.x) +
            Math.abs(sample.y) +
            Math.abs(sample.z)

        const now = Date.now()

        if (force > 15 && now - this.lastTrigger > 400) {

            this.lastTrigger = now

            this.state.repDisplay++
            this.state.stats.repsTotal++

            // random form check
            if (force < 40) {

                this.state.stats.repsOk++
                this.state.stats.lastMessage = 'OK'

            } else {

                this.state.stats.repsBad++
                this.state.stats.lastMessage = 'Too Fast'

            }

            this.state.stats.score = this.state.stats.repsOk * 10

            this.emit()

        }

    }

}