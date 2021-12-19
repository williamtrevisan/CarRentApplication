import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { Connection, createConnection } from "typeorm";

let connection: Connection;

describe("List Categories Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);
  
    await connection.query(
      `
        INSERT INTO USERS(id, name, password, email, driver_license, admin, created_at)
        values('${id}', 'admin', '${password}', 'admin@rental.com.br', 'XXXXXXXXX', true, 'now()');
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to list all categories", async () => {
    const responseToken = await request(app)
      .post("/sessions")
      .send({
        email: "admin@rental.com.br",
        password: "admin"
      });
    const { token } = responseToken.body;
    const category = {
      name: "Category Name Supertest",
      description: "Category Description Supertest",
    };

    await request(app)
      .post("/categories")
      .send(category)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0].name).toEqual(category.name);
  });
});