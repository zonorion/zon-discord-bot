import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { Token } from '../response/token'
import { plainToInstance } from 'class-transformer'
import { Guild } from '../response/guild'
import * as fs from 'fs/promises'
import { Channel } from '../response/channel'

@Injectable()
export class DiscordService implements OnModuleInit {
    constructor(private readonly config: ConfigService, private readonly httpService: HttpService) {}

    private token: Token

    async onModuleInit() {
        // https://discord.com/api/v9/channels/908831732575383583/messages
        // const token = await this.login()
        // console.log(token)
        // const token = { token: 'MjA5MjEzNzQzNTc2MzgzNDg4.Grw366.OKKxfAkb5mXFPhaYHH6oroQq-JXucIPKPF43yU' } as Token
        // await this.getGuilds(token)
        // const guild = await this.getGuildDetail(token, '1008646529038430269')
        // console.log(guild)
        // const channels = await this.getGuildChannels(token, '1038635554503393341')
        // console.log(channels)
    }

    async getToken(): Promise<Token> {
        if (!this.token) {
            this.token = await this.login()
        }
        return this.token
    }

    async login(): Promise<Token> {
        try {
            const request = this.httpService.post(`${this.config.get('DC_API_ENDPOINT')}/auth/login`, {
                login: this.config.get('DC_USER'),
                password: this.config.get('DC_PASSWORD'),
            })
            const { data } = await lastValueFrom(request)
            return plainToInstance(Token, data)
        } catch (e) {
            throw e
        }
    }

    async getGuilds(): Promise<void> {
        try {
            const token = await this.getToken()
            const request = this.httpService.get(`${this.config.get('DC_API_ENDPOINT')}/users/@me/affinities/guilds`, {
                headers: { authorization: token.token, 'user-agent': this.config.get('DC_USER_AGENT') },
            })
            const { data } = await lastValueFrom(request)
            console.log(`Total guilds: ${data.guild_affinities.length}`)
            for (const guild of data.guild_affinities) {
                try {
                    const detail = await this.getGuildDetail(guild.guild_id)
                    await fs.appendFile('guilds.txt', `${detail.id} - ${detail.name} \n`)
                } catch (e) {
                    console.error(`Can not get guild: ${guild.guild_id} information`)
                }
            }
        } catch (e) {
            throw e
        }
    }

    async getGuildDetail(guildId: string): Promise<Guild> {
        try {
            const token = await this.getToken()
            const request = this.httpService.get(`${this.config.get('DC_API_ENDPOINT')}/guilds/${guildId}`, {
                headers: { authorization: token.token, 'user-agent': this.config.get('DC_USER_AGENT') },
            })
            const { data } = await lastValueFrom(request)
            return plainToInstance(Guild, data, { excludeExtraneousValues: true })
        } catch (e) {
            throw e
        }
    }

    async getGuildChannels(guildId: string): Promise<Channel[]> {
        try {
            const token = await this.getToken()
            const request = this.httpService.get(`${this.config.get('DC_API_ENDPOINT')}/guilds/${guildId}/channels`, {
                headers: { authorization: token.token, 'user-agent': this.config.get('DC_USER_AGENT') },
            })
            const { data } = await lastValueFrom(request)
            return data.map((channel) => plainToInstance(Channel, channel, { excludeExtraneousValues: true }))
        } catch (e) {
            throw e
        }
    }

    async sendMessage(channelId: string, message: string): Promise<boolean> {
        try {
            const token = await this.getToken()
            const request = this.httpService.post(
                `${this.config.get('DC_API_ENDPOINT')}/channels/${channelId}/messages`,
                {
                    content: message,
                },
                {
                    headers: { authorization: token.token, 'user-agent': this.config.get('DC_USER_AGENT') },
                },
            )
            await lastValueFrom(request)
            return true
        } catch (e) {
            throw e
        }
    }
}
