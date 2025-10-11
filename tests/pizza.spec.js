import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  expect(await page.title()).toBe("JWT Pizza");
});

//The function that determines all routes
async function basicInit(page) {
  let loggedInUser;
  const validUsers = {
    "a@jwt.com": {
      id: 3,
      name: "Kai Chen",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: "admin" }],
    },
    "newFranchise@jwt.com": {
      id: 5,
      name: "A New Franchise",
      email: "newFranchise@jwt.com",
      password: "passfranchise",
      roles: [{ role: "diner" }, { objectId: 9, role: "franchisee" }],
    },
  };

  // Enable login/logout/register for the given user
  await page.route("*/**/api/auth", async (route, request) => {
    if (request.method() === "POST") {
      const { name, email, password } = route.request().postDataJSON();
      if (!name || !email || !password) {
        await route.fulfill({ status: 400, json: { error: "Bad Request" } });
        return;
      }
      const existingUser = validUsers[email];
      const id = existingUser ? existingUser.id : 6;
      const registerRes = {
        user: {
          id: id,
          name: name,
          email: email,
          roles: [{ role: "diner" }],
        },
        token: "abcdef",
      };

      const newUser = { password: password, ...registerRes.user };
      validUsers[email] = newUser;

      await route.fulfill({ json: registerRes });
    } else if (request.method() === "DELETE") {
      const logoutRes = { message: "logout successful" };

      await route.fulfill({ json: logoutRes });
    } else {
      const loginReq = route.request().postDataJSON();
      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = validUsers[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: "abcdef",
      };
      await route.fulfill({ json: loginRes });
    }
  });

  // Update a valid user
  await page.route("*/**/api/user/**", async (route, request) => {
    if (request.method() === "DELETE") {
      const userRes = { message: "user deleted" };

      await route.fulfill({ json: userRes });
      return;
    } else {
      const updateReq = route.request().postDataJSON();
      const updateRes = { user: updateReq, token: "abcdef" };
      for (const userEmail in validUsers) {
        if (validUsers[userEmail].id === updateReq.id) {
          const newUser = {
            password: validUsers[userEmail].password,
            ...updateReq,
          };
          delete validUsers[userEmail];
          validUsers[updateReq.email] = newUser;

          await route.fulfill({ json: updateRes });
          return;
        }
      }
    }
    await route.fulfill({ status: 403, json: { error: "Unauthorized" } });
  });

  // Return the currently logged in user
  await page.route("*/**/api/user/me", async (route) => {
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });

  // Return the list of users
  await page.route(/\/api\/user(\?.*)?$/, async (route) => {
    expect(route.request().method()).toBe("GET");
    const users = Object.values(validUsers);
    const listUsersRes = { users: users, more: true };
    await route.fulfill({ json: listUsersRes });
  });

  // A standard menu
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

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
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
      more: true,
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  // Create a new franchise
  await page.route("*/**/api/franchise", async (route) => {
    const franchiseReq = route.request().postDataJSON();

    if (franchiseReq.admins.length === 0) {
      await route.fulfill({ status: 400, json: { error: "Bad Request" } });
      return;
    }
    const franchisee = validUsers[franchiseReq.admins[0].email];
    if (!franchisee) {
      await route.fulfill({ status: 404, json: { error: "Not Found" } });
      return;
    }

    const franchiseRes = {
      stores: [],
      id: 1,
      name: franchiseReq.name,
      admins: [
        {
          email: franchisee.email,
          id: franchisee.id,
          name: franchiseReq.name,
        },
      ],
    };

    expect(route.request().method()).toBe("POST");
    await route.fulfill({ json: franchiseRes });
  });

  // Gets the user's franchise
  await page.route("*/**/api/franchise/**", async (route, request) => {
    if (request.method() === "DELETE") {
      const franchiseRes = { message: "franchise deleted" };

      await route.fulfill({ json: franchiseRes });
    } else {
      const franchiseRes = [
        {
          id: 1,
          name: "Brand New Franchise",
          admins: [
            {
              id: 5,
              name: "A New Franchise",
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
    }
  });

  // Create a new store
  await page.route("*/**/api/franchise/**/store", async (route) => {
    const storeReq = route.request().postDataJSON();
    const storeRes = {
      id: 1,
      franchiseId: 1,
      name: storeReq.name,
    };

    expect(route.request().method()).toBe("POST");
    await route.fulfill({ json: storeRes });
  });

  // Delete a store
  await page.route("*/**/api/franchise/**/store/**", async (route) => {
    const storeRes = { message: "store deleted" };

    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: storeRes });
  });

  // Order a pizza.
  await page.route("*/**/api/order", async (route, request) => {
    if (request.method() === "POST") {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: "eyJpYXQ",
      };
      await route.fulfill({ json: orderRes });
    } else {
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: [] });
    }
  });

  await page.goto("http://localhost:5173/");
}

test("login", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "KC" })).toBeVisible();
});

test("purchase with login", async ({ page }) => {
  await basicInit(page);

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
  await page.getByPlaceholder("Email address").fill("a@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("admin");
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
  await basicInit(page);

  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByText("The secret sauce")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Our employees" })
  ).toBeVisible();
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
});

test("register and logout", async ({ page }) => {
  await basicInit(page);

  // Register new user and logout
  await page.getByRole("link", { name: "Register" }).click();
  await page
    .getByRole("textbox", { name: "Full name" })
    .fill("A New Franchise");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("passfranchise");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
});

test("create franchise", async ({ page }) => {
  await basicInit(page);

  // Login admin
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // Add franchisee
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
});

test("create store", async ({ page }) => {
  await basicInit(page);

  // Login as franchisee
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("passfranchise");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // Create store
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

test("login and view diner dashboard", async ({ page }) => {
  await basicInit(page);

  // Login
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("newFranchise@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("passfranchise");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // View diner dashboard
  await page.getByRole("link", { name: "AF" }).click();
  await expect(page.getByText("Your pizza kitchen")).toBeVisible();
  await expect(page.getByText("name:").first()).toBeVisible();
  await expect(page.getByText("email:").first()).toBeVisible();
  await expect(page.getByText("role:")).toBeVisible();
});

test("login and view admin dashboard", async ({ page }) => {
  await basicInit(page);

  // Login admin
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // Enter admin dashboard
  await page.getByRole("link", { name: "Admin", exact: true }).click();

  // Assert user list visibility and functionality
  await expect(page.getByRole("cell", { name: "a@jwt.com" })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "newFranchise@jwt.com" })
  ).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "Kai Chen a@jwt.com admin" })
      .getByRole("button")
  ).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "A New Franchise newFranchise@" })
      .getByRole("button")
  ).toBeVisible();
  await page.getByRole("button", { name: "»" }).first().click();
  await page.getByRole("button", { name: "«" }).first().click();
  await page.getByRole("textbox", { name: "Filter users" }).fill("test");
  await page
    .getByRole("cell", { name: "test Submit" })
    .getByRole("button")
    .click();

  // Assert franchise and store visibility and functionality
  await expect(page.getByRole("cell", { name: "Spanish Fork" })).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "Spanish Fork 0 ₿ Close" })
      .getByRole("button")
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: "PizzaCorp" })).toBeVisible();
  await expect(
    page.getByRole("row", { name: "PizzaCorp Close" }).getByRole("button")
  ).toBeVisible();
  await page.getByRole("button", { name: "»" }).nth(1).click();
  await page.getByRole("button", { name: "«" }).nth(1).click();
  await page.getByRole("textbox", { name: "Filter franchises" }).fill("test");
  await page.getByRole("button", { name: "Submit" }).nth(1).click();
});

test("delete store and franchise", async ({ page }) => {
  await basicInit(page);

  // Login admin
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // Assert franchise and store visibility
  await page.getByRole("link", { name: "Admin", exact: true }).click();
  await expect(page.getByRole("cell", { name: "Spanish Fork" })).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "Spanish Fork 0 ₿ Close" })
      .getByRole("button")
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: "PizzaCorp" })).toBeVisible();
  await expect(
    page.getByRole("row", { name: "PizzaCorp Close" }).getByRole("button")
  ).toBeVisible();

  // Delete Store
  await page
    .getByRole("row", { name: "Spanish Fork 0 ₿ Close" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(
    page.getByText("Are you sure you want to close the PizzaCorp store")
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  // Delete Franchise
  await page
    .getByRole("row", { name: "PizzaCorp Close" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(
    page.getByText("Are you sure you want to close the PizzaCorp franchise")
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("link", { name: "Logout" }).click();
});

test("update user", async ({ page }) => {
  await basicInit(page);
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  await expect(page.getByRole("main")).toContainText("pizza diner");

  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.getByRole("textbox").first().fill("pizza dinerx");
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

  await expect(page.getByRole("main")).toContainText("pizza dinerx");

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();

  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  await expect(page.getByRole("main")).toContainText("pizza dinerx");
});

test("delete user", async ({ page }) => {
  await basicInit(page);

  // Login admin
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByText("The web's best pizza", { exact: true })
  ).toBeVisible();

  // Assert user list visibility
  await page.getByRole("link", { name: "Admin", exact: true }).click();

  await expect(page.getByRole("cell", { name: "a@jwt.com" })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "newFranchise@jwt.com" })
  ).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "Kai Chen a@jwt.com admin" })
      .getByRole("button")
  ).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "A New Franchise newFranchise@" })
      .getByRole("button")
  ).toBeVisible();

  // Delete User
  await page
    .getByRole("row", { name: "A New Franchise newFranchise@" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(page.getByText("Are you sure you want to")).toBeVisible();
  await page.getByRole("button", { name: "Delete User" }).click();

  await page.getByRole("link", { name: "Logout" }).click();
});
