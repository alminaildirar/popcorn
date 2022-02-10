import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Actor } from "./Actor";



@Entity()
export class ActorComments extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    author: string;

    @ManyToOne(type => Actor, actor => actor.comments, {onDelete:"CASCADE"}  )
    actor: Actor

}