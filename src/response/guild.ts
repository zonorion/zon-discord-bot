import { Expose } from 'class-transformer'

export class Guild {
    @Expose()
    id: string
    @Expose()
    name: string
}
