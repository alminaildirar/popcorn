import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, CreateDateColumn} from "typeorm";
import { User } from "./User";
import { ActorLikes } from "./ActorLikes";
import { ActorComments } from "./ActorComments";



@Entity()
export class Actor extends BaseEntity{

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

    @ManyToOne(type => User, user => user.actors,  {onDelete:"CASCADE"} )
    user: User

    @OneToMany(type => ActorComments, comments => comments.actor)
    comments: ActorComments[]

    @OneToMany(type => ActorLikes, likes => likes.actor,)
    likes: ActorLikes[]

    

}
