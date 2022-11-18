import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './discord/discord.module'
import { WizardLandModule } from './wizard-land/wizard.-land.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        DiscordModule,
        WizardLandModule,
    ],
})
export class AppModule {}
