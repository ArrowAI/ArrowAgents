import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity()
export class FlowExecutorStore {
    @PrimaryGeneratedColumn()
    id: number = 0;
    @Column({
        length: 100,
    })
    flowId: string = '';

    @Column("json")
    context: Record<string, any> = {};

    @Column({
        length: 100,
    })
    currentNodeId: string = '';
}