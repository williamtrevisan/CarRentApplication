import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");

  const id = uuidV4();
  const password = await hash("admin", 8);

  await connection.query(
    `
      INSERT INTO USERS(id, name, password, email, driver_license, admin, created_at)
      values('${id}', 'admin', '${password}', 'admin@rental.com.br', 'XXXXXXXXX', true, 'now()');
    `
  );
}

create().then(() => console.log("User admin created!"));
