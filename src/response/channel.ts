import { Expose } from 'class-transformer'

export class Channel {
    @Expose()
    id: string
    @Expose()
    name: string
    @Expose({ name: 'rate_limit_per_user' })
    rateLimit: number
}
