import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
import { FilmComments } from "./FilmComments";
import { User } from "./User";
import { FilmLikes } from "./FilmLikes";


@Entity()
export class Film extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: "longtext"})
    description: string;

    @Column()
    visible: boolean;

    @Column({ default: null, type: "longtext" })
    image: string;

    @CreateDateColumn()
    created?: Date

    @ManyToOne(type => User, user => user.films,  {onDelete:"CASCADE"} )
    user: User

    @OneToMany(type => FilmComments, comments => comments.film)
    comments: FilmComments[]

    @OneToMany(type => FilmLikes, likes => likes.film,)
    likes: FilmLikes[]

    

}
