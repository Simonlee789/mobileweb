import { Haptics, ImpactStyle } from '@capacitor/haptics'

export class HapticsService {

    async success() {

        await Haptics.impact({
            style: ImpactStyle.Medium
        })

    }

    async warning() {

        await Haptics.impact({
            style: ImpactStyle.Heavy
        })

    }

}