import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  username: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  password: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  driver_license: string;

  @Column()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  admin: boolean;

  @CreateDateColumn()
  created_at: Date | undefined;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };
