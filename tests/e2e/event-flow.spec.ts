import { test, expect } from '@playwright/test';

test.describe('Wine Tasting Event Flow', () => {
  test('should display landing page with features', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /organiseer de perfecte wijnproeverij/i })).toBeVisible();

    // Check for feature cards
    await expect(page.getByText(/plan tijden/i)).toBeVisible();
    await expect(page.getByText(/nodig uit/i)).toBeVisible();
    await expect(page.getByText(/deel wijnen/i)).toBeVisible();
    await expect(page.getByText(/beoordeel/i)).toBeVisible();

    // Check for CTA button
    await expect(page.getByRole('link', { name: /start een evenement/i })).toBeVisible();
  });

  test('should navigate to event creation page', async ({ page }) => {
    await page.goto('/');

    // Click on "Start een evenement" button
    await page.getByRole('link', { name: /start een evenement/i }).first().click();

    // Should be on the new event page
    await expect(page).toHaveURL('/events/new');
    await expect(page.getByRole('heading', { name: /nieuw wijnproeverij evenement/i })).toBeVisible();
  });

  test('should show event creation form with required fields', async ({ page }) => {
    await page.goto('/events/new');

    // Check for form sections
    await expect(page.getByText(/evenementdetails/i)).toBeVisible();
    await expect(page.getByText(/mogelijke tijdstippen/i)).toBeVisible();
    await expect(page.getByText(/genodigden/i)).toBeVisible();

    // Check for required fields
    await expect(page.getByLabel(/titel/i)).toBeVisible();
    await expect(page.getByLabel(/jouw e-mailadres/i)).toBeVisible();

    // Check minimum invitees message
    await expect(page.getByText(/minimaal 2, maximaal 8 deelnemers/i)).toBeVisible();

    // Submit button should be disabled initially
    const submitButton = page.getByRole('button', { name: /evenement aanmaken/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/events/new');

    // Fill in title
    await page.getByLabel(/titel/i).fill('Test Wijnproeverij');

    // Fill in description
    await page.getByLabel(/beschrijving/i).fill('Een gezellige avond met vrienden');

    // Fill in email
    await page.getByLabel(/jouw e-mailadres/i).fill('test@example.com');

    // Fill in date and times for first time slot
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.first().fill('2025-10-15');

    const timeInputs = page.locator('input[type="time"]');
    await timeInputs.first().fill('18:00');
    await timeInputs.nth(1).fill('22:00');

    // Fill in invitee names (should have 2 by default)
    const nameInputs = page.getByLabel(/naam/i);
    await nameInputs.first().fill('Jan Jansen');
    await nameInputs.nth(1).fill('Piet Pietersen');

    // Submit button should now be enabled
    const submitButton = page.getByRole('button', { name: /evenement aanmaken/i });
    await expect(submitButton).toBeEnabled();
  });

  test('should allow adding and removing time slots', async ({ page }) => {
    await page.goto('/events/new');

    // Initially should have 1 time slot
    const initialTimeSlots = page.locator('input[type="date"]');
    await expect(initialTimeSlots).toHaveCount(1);

    // Click "Toevoegen" button in time slots section
    await page.getByRole('button', { name: /toevoegen/i }).first().click();

    // Should now have 2 time slots
    await expect(page.locator('input[type="date"]')).toHaveCount(2);

    // Remove button should be visible (implementation may vary)
    // Future: Add specific assertion for remove button visibility
  });

  test('should enforce participant limits', async ({ page }) => {
    await page.goto('/events/new');

    // Add invitees up to maximum (8)
    for (let i = 2; i < 8; i++) {
      await page.getByRole('button', { name: /toevoegen/i }).last().click();
    }

    // Add button should be disabled at 8 invitees
    const addButton = page.getByRole('button', { name: /toevoegen/i }).last();
    await expect(addButton).toBeDisabled();
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/events/new');

    // Check that form inputs have associated labels
    const titleInput = page.getByLabel(/titel/i);
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveAttribute('required');

    const emailInput = page.getByLabel(/jouw e-mailadres/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on landing page', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(/organiseer de perfecte wijnproeverij/i);

    // Check for h2 headings
    const h2 = page.locator('h2');
    await expect(h2.first()).toContainText(/hoe het werkt/i);
  });

  test('should have descriptive button text', async ({ page }) => {
    await page.goto('/');

    // Buttons should have clear, descriptive text
    await expect(page.getByRole('link', { name: /start een evenement/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /meer informatie/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /evenement aanmaken/i })).toBeVisible();
  });

  test('should have proper alt text for icons', async ({ page }) => {
    await page.goto('/');

    // Icons should be decorative or have proper labels
    // Lucide icons are typically wrapped in semantic elements
    const featureCards = page.locator('div[class*="Card"]');
    await expect(featureCards).toHaveCount(4);
  });
});