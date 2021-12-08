import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string | undefined;

  @Column()
  username: string | undefined;

  @Column()
  password: string | undefined;

  @Column()
  email: string | undefined;

  @Column()
  driver_license: string | undefined;

  @Column()
  admin: boolean | undefined;

  @CreateDateColumn()
  created_at: Date | undefined;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };
