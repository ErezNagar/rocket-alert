import { render, screen, fireEvent } from "@testing-library/react";
import TimeToShelter from "../components/TimeToShelter";
import Tracking from "../tracking";
import Utilities from "../utilities/utilities";

// Mock dependencies
jest.mock("../tracking", () => ({
  visibleEvent: jest.fn(),
  timeToShelterLocationClick: jest.fn(),
  shareTimetoShelterClick: jest.fn(),
}));

jest.mock("../utilities/utilities", () => ({
  useIsVisible: jest.fn(),
  getDistanceByTimeToShelter: jest.fn(),
}));

describe("TimeToShelter", () => {
  const baseAlert = {
    countdownSec: 10,
    areaNameEn: "Gaza Envelope",
    englishName: "Sderot",
    name: "שדרות",
    lat: 31.5,
    lon: 34.6,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Utilities.useIsVisible.mockReturnValue(true);
    Utilities.getDistanceByTimeToShelter.mockReturnValue(10);
  });

  it("does not render if no valid alerts", () => {
    render(<TimeToShelter alerts={[]} />);
    expect(screen.queryByText(/get to shelter/i)).not.toBeInTheDocument();
  });

  it("renders when valid alert exists", () => {
    render(<TimeToShelter alerts={[baseAlert]} />);

    expect(
      screen.getByText("You have 10 seconds to get to shelter!"),
    ).toBeInTheDocument();

    expect(screen.getByText(/If you lived in/)).toBeInTheDocument();
  });

  it("renders immediate warning when distance <= 5", () => {
    Utilities.getDistanceByTimeToShelter.mockReturnValue(4);

    render(<TimeToShelter alerts={[baseAlert]} />);

    expect(screen.getByText("Get to shelter immediately!")).toBeInTheDocument();
  });

  it("renders clickable location when lat/lon exist", () => {
    const onToggleMapFocus = jest.fn();

    render(
      <TimeToShelter
        alerts={[baseAlert]}
        onToggleMapFocus={onToggleMapFocus}
      />,
    );

    const location = screen.getByText("Sderot");
    fireEvent.click(location);

    expect(Tracking.timeToShelterLocationClick).toHaveBeenCalled();
    expect(onToggleMapFocus).toHaveBeenCalledWith(baseAlert);
  });

  it("renders non-clickable location when lat/lon missing", () => {
    const alertWithoutCoords = {
      ...baseAlert,
      lat: null,
      lon: null,
    };

    render(<TimeToShelter alerts={[alertWithoutCoords]} />);
    const spans = screen.queryAllByText("Sderot", { selector: "span" });
    expect(spans.length).toBe(0);
  });

  it("fires visible tracking event when visible", () => {
    render(<TimeToShelter alerts={[baseAlert]} />);
    expect(Tracking.visibleEvent).toHaveBeenCalledWith("TimeToShelter");
  });

  it("does not render if alert is not in relevant area", () => {
    const alert = {
      ...baseAlert,
      areaNameEn: "Tel Aviv",
    };

    render(<TimeToShelter alerts={[alert]} />);
    expect(screen.queryByText(/If you lived in/)).not.toBeInTheDocument();
  });

  it("renders share link with correct text", () => {
    render(<TimeToShelter alerts={[baseAlert]} />);

    const link = screen.getAllByRole("link")[0];

    expect(link.href).toContain("twitter.com/share");
    expect(link.href).toContain("Sderot");
  });

  it("fires tracking on share click", () => {
    render(<TimeToShelter alerts={[baseAlert]} />);

    const link = screen.getAllByRole("link")[0];
    fireEvent.click(link);

    expect(Tracking.shareTimetoShelterClick).toHaveBeenCalled();
  });

  it("uses fallback name when englishName is missing", () => {
    const alert = {
      ...baseAlert,
      englishName: null,
      name: "אשקלון",
    };

    render(<TimeToShelter alerts={[alert]} />);
    expect(screen.getByText(/אשקלון/)).toBeInTheDocument();
  });
});
