import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable} from "typeorm";
import { Actor } from "./Actor";


@Entity()
export class ActorLikes extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ownerID: number;

    @ManyToOne(type => Actor, actor => actor.likes,  {onDelete:"CASCADE"}  )
    @JoinTable()
    actor: Actor

}
