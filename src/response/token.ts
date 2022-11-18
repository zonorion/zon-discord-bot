import { Expose } from 'class-transformer'

export class Token {
    token: string
    @Expose({ name: 'user_id' })
    userId: string
}
