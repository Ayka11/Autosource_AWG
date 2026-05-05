// Importing necessary functions from React Testing Library
import { render, screen } from "@testing-library/react"; // Only import from @testing-library/react
import App from "./App"; // Your App component

test("renders login link", () => {
  render(<App />); // Render the App component

  // Test if the login link is present in the document
  const loginLink = screen.getByRole('link', { name: /login/i });

  // Expect the login link to be in the document
  expect(loginLink).toBeInTheDocument();
});
