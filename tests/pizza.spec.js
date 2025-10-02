import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  expect(await page.title()).toBe("JWT Pizza");
});

test("Login", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = {
      user: {
        id: 3,
        name: "Kai Chen",
        email: "d@jwt.com",
        roles: [{ role: "admin" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("Mama Ricci's kitchen")).toBeVisible();
});

test("purchase with login", async ({ page }) => {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route("*/**/api/franchise*", async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: "LotaPizza",
          stores: [
            { id: 4, name: "Lehi" },
            { id: 5, name: "Springville" },
            { id: 6, name: "American Fork" },
          ],
        },
        { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
        { id: 4, name: "topSpot", stores: [] },
      ],
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "a" };
    const loginRes = {
      user: {
        id: 3,
        name: "Kai Chen",
        email: "d@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/order", async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: "Veggie", price: 0.0038 },
        { menuId: 2, description: "Pepperoni", price: 0.0042 },
      ],
      storeId: "4",
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
        ],
        storeId: "4",
        franchiseId: 2,
        id: 23,
      },
      jwt: "eyJpYXQ",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto("http://localhost:5173/");

  // Go to order page
  await page.getByRole("button", { name: "Order now" }).click();

  // Create order
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Login
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Pay
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!"
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();

  // Check balance
  await expect(page.getByText("0.008")).toBeVisible();
});

test("view footer pages", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByText("The secret sauce")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Our employees" })
  ).toBeVisible();
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
});

test("register franchise and create a franchise and stores for franchise", async ({
  page,
}) => {
  await page.route("*/**/api/auth", async (route, request) => {
    if (request.method() === "POST") {
      const registerReq = {
        name: "My New Franchise",
        email: "newFranchise@jwt.com",
        password: "passfranchise",
      };
      const registerRes = {
        user: {
          id: 5,
          name: "My New Franchise",
          email: "newFranchise@jwt.com",
          roles: [{ role: "diner" }],
        },
        token: "abcdef",
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(registerReq);
      await route.fulfill({ json: registerRes });
    } else if (request.method() === "DELETE") {
      const logoutRes = { message: "logout successful" };

      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: logoutRes });
    } else {
      const requestBody = request.postDataJSON();
      if (requestBody && requestBody.email === "newFranchise@jwt.com") {
        const loginReq = {
          email: "newFranchise@jwt.com",
          password: "passfranchise",
        };
        const loginRes = {
          user: {
            id: 5,
            name: "My New Franchise",
            email: "newFranchise@jwt.com",
            roles: [{ role: "diner" }, { objectId: 9, role: "franchisee" }],
          },
          token: "abcdef",
        };
        expect(route.request().method()).toBe("PUT");
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
      } else {
        const loginReq = { email: "a@jwt.com", password: "admin" };
        const loginRes = {
          user: {
            id: 3,
            name: "Kai Chen",
            email: "d@jwt.com",
            roles: [{ role: "admin" }],
          },
          token: "abcdef",
        };
        expect(route.request().method()).toBe("PUT");
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
      }
    }
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = {
      stores: [],
      id: "",
      name: "Brand New Franchise",
      admins: [
        {
          email: "newFranchise@jwt.com",
        },
      ],
    };
    const franchiseRes = {
      stores: [],
      id: 2,
      name: "Brand New Franchise",
      admins: [
        {
          email: "newFranchise@jwt.com",
          id: 5,
          name: "My New Franchise",
        },
      ],
    };

    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/franchise/**", async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "Brand New Franchise",
        admins: [
          {
            id: 5,
            name: "My New Franchise",
            email: "newFranchise@jwt.com",
          },
        ],
        stores: [
          {
            id: 1,
            name: "a whole new store",
            totalRevenue: 0,
          },
        ],
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/franchise/**/store", async (route) => {
    const storeReq = {
      id: "",
      name: "a whole new store",
    };
    const storeRes = {
      id: 1,
      franchiseId: 2,
      name: "a whole new store",
    };

    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });

  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Register" }).click();
  await page
    .getByRole("textbox", { name: "Full name" })
    .fill("My New Franchise");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("passfranchise");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByText("Mama Ricci's kitchen")).toBeVisible();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Brand New Franchise");
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Mama Ricci's kitchen")).toBeVisible();

  await page.getByRole("link", { name: "Logout" }).click();

  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("passfranchise");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByText("Brand New Franchise")).toBeVisible();
  await page.getByRole("button", { name: "Create store" }).click();
  await page
    .getByRole("textbox", { name: "store name" })
    .fill("a whole new store");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Brand New Franchise")).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "a whole new store" })
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: "₿" })).toBeVisible();
});
