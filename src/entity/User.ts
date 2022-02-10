import {Entity, PrimaryGeneratedColumn, BaseEntity, Column} from "typeorm";

export enum method{
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook'
}


@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: method})
    method: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column({nullable:true})
    password: string;

    @Column({nullable:true})
    likedFilms: string;

}
