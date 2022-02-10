import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { Film } from "./Film";


@Entity()
export class FilmComments extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    author: string;

    @ManyToOne(type => Film, film => film.comments, {onDelete:"CASCADE"}  )
    film: Film

}