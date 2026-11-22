import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HelpPage } from "./HelpPage";

describe("HelpPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens the manual for the current device and can switch platforms", () => {
    render(
      <HelpPage
        onBack={() => undefined}
        userAgent="Mozilla/5.0 (X11; Linux x86_64)"
      />,
    );
    expect(screen.getByRole("heading", { name: "Help" })).toBeInTheDocument();
    expect(screen.getByText(/You are on Linux/)).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Linux (this device)" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByText("/usr/share/odm/browser-extension"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Windows" }));
    expect(
      screen.getAllByText(/Open Download Manager contributors/).length,
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("tab", { name: "macOS" }));
    expect(screen.getByText(/brew install ffmpeg/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "On every device" }),
    ).toBeInTheDocument();
  });
});
