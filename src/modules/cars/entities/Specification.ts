import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("specifications")
class Specification {
  @PrimaryColumn()
  id?: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  description: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Specification };
