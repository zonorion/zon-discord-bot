import { Injectable, OnModuleInit } from '@nestjs/common'
import { DiscordService } from '../discord/discord.service'
import { Channel } from '../response/channel'

@Injectable()
export class WizardLandService implements OnModuleInit {
    private readonly CHANNEL_NAMES: string[] = ['wizard-chat', 'wiz-hi-gn-gm']
    private readonly RANDOM_CHATS: string[] = [
        'Wassup',
        'Hello',
        'Hi',
        'Gm buddy',
        'Whats up guys?',
        'Gm mates',
        'Wiz wiz',
        'Wen',
        'LFG',
        'LFM',
    ]
    private readonly GM_CHATS: string[] = ['Gm', 'Gn', 'Hi', 'Wiz']
    private readonly GUILD_ID: string = '1038635554503393341'
    private readonly DEFAULT_RATE = 120

    constructor(private readonly discordService: DiscordService) {}

    async onModuleInit() {
        await this.run()
    }

    getMessageByType(type: string): string[] {
        switch (type) {
            case 'RANDOM_CHATS':
                return this.RANDOM_CHATS
            default:
                return this.GM_CHATS
        }
    }

    async run(): Promise<void> {
        try {
            const channels = await this.getChannelIds()
            for (const channel of channels) {
                if (channel.name.toLowerCase().includes('wizard-chat')) {
                    setInterval(
                        () => this.sendMessage(channel, 'RANDOM_CHATS'),
                        (channel.rateLimit && channel.rateLimit) >= this.DEFAULT_RATE
                            ? channel.rateLimit * 1e3
                            : this.DEFAULT_RATE * 1e3,
                    )
                }
                if (channel.name.toLowerCase().includes('wiz-hi-gn-gm')) {
                    setInterval(
                        () => this.sendMessage(channel, 'GM_CHATS'),
                        (channel.rateLimit && channel.rateLimit) >= this.DEFAULT_RATE
                            ? channel.rateLimit * 1e3
                            : this.DEFAULT_RATE * 1e3,
                    )
                }
            }
        } catch (e) {
            console.error(`WizardLandService::Run bot error: `, e)
        }
    }

    async sendMessage(channel: Channel, type: string) {
        try {
            console.log(`WizardLandService::start sending message to ${channel.name}`)
            const messages = this.getMessageByType(type)
            const message = messages[Math.floor(Math.random() * messages.length)]
            await this.discordService.sendMessage(channel.id, message)
        } catch (e) {
            console.error(`WizardLandService::Send message to channel ${channel.name} error: `, e)
        }
    }

    async getChannelIds(): Promise<Channel[]> {
        try {
            const channels = await this.discordService.getGuildChannels(this.GUILD_ID)
            return channels.filter((c) => this.CHANNEL_NAMES.some((name) => c.name.toLowerCase().includes(name)))
        } catch (e) {
            throw e
        }
    }
}
