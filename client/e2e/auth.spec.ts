import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Dead Pigeons" })).toBeVisible();
    await expect(page.getByPlaceholder("din@email.dk")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log ind" })).toBeVisible();
  });

  test("should show validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Log ind" }).click();

    await expect(page.getByText("Email er påkrævet")).toBeVisible();
    await expect(page.getByText("Adgangskode er påkrævet")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "Opret konto" }).click();

    await expect(page).toHaveURL("/register");
    await expect(page.getByRole("heading", { name: "Opret konto" })).toBeVisible();
  });

  test("should display register page with all fields", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByPlaceholder("Dit fulde navn")).toBeVisible();
    await expect(page.getByPlaceholder("din@email.dk")).toBeVisible();
    await expect(page.getByPlaceholder("+45 12 34 56 78")).toBeVisible();
    await expect(page.getByRole("button", { name: "Opret konto" })).toBeVisible();
  });

  test("should show password validation errors", async ({ page }) => {
    await page.goto("/register");

    await page.getByPlaceholder("Dit fulde navn").fill("Test User");
    await page.getByPlaceholder("din@email.dk").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("weak");
    await page.getByPlaceholder("••••••••").last().fill("weak");

    await page.getByRole("button", { name: "Opret konto" }).click();

    await expect(page.getByText("Adgangskode skal være mindst 8 tegn")).toBeVisible();
  });

  test("should navigate back to login from register", async ({ page }) => {
    await page.goto("/register");

    await page.getByRole("link", { name: "Log ind" }).click();

    await expect(page).toHaveURL("/login");
  });

  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL("/login");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("din@email.dk").fill("invalid@example.com");
    await page.getByPlaceholder("••••••••").fill("wrongpassword");
    await page.getByRole("button", { name: "Log ind" }).click();

    // Wait for error response
    await expect(page.getByText(/Forkert email|Der opstod en fejl/)).toBeVisible({
      timeout: 10000,
    });
  });
});
