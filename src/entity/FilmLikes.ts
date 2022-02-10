import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable} from "typeorm";
import { Film } from "./Film";


@Entity()
export class FilmLikes extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ownerID: number;

    @ManyToOne(type => Film, film => film.likes,  {onDelete:"CASCADE"}  )
    @JoinTable()
    film: Film

}
