import { Motion } from '@capacitor/motion'
import type { MotionSample } from './types'

export class MotionService {

    listener: any = null

    async start(callback: (s: MotionSample) => void) {

        this.listener = await Motion.addListener('accel', (event) => {

            callback({
                x: event.acceleration.x || 0,
                y: event.acceleration.y || 0,
                z: event.acceleration.z || 0,
                timestamp: Date.now()
            })

        })

    }

    async stop() {

        if (this.listener) {
            await this.listener.remove()
            this.listener = null
        }

    }

}