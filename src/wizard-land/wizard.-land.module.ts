import { Module } from '@nestjs/common'
import { DiscordModule } from '../discord/discord.module'
import { WizardLandService } from './wizard-land.service'

@Module({
    imports: [DiscordModule],
    providers: [WizardLandService],
    exports: [],
})
export class WizardLandModule {}
