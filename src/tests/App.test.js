import AlertClient from "../rocket_alert_client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header/Header";

jest.mock("wretch", () => {
  const catchFn = () => {
    return "catch";
  };
  const json = () => {
    return Promise.resolve({
      success: true,
      error: null,
      payload: [{ timeStamp: "2021-05-10", alerts: 225 }],
    });
  };
  const get = () => ({ json });
  const query = (query) => ({ get });
  const url = (url) => ({ query });
  return () => ({ url });
});

const DATE_RANGE = {
  from: new Date("2021-05-10"),
  to: new Date("2021-05-10"),
};

describe("AlertClient", () => {
  describe("getTotalAlertsByDay", () => {
    it("should throw when 'from' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlertsByDay(null, DATE_RANGE.to).catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
      await AlertClient.getTotalAlertsByDay("", DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
    });
    it("should throw when 'to' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlertsByDay(DATE_RANGE.from, null).catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
      await AlertClient.getTotalAlertsByDay(DATE_RANGE.from, "").catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
    });
    it("should return a valid response", async () => {
      expect.assertions(1);
      await AlertClient.getTotalAlertsByDay(
        DATE_RANGE.from,
        DATE_RANGE.to
      ).then((res) => {
        expect(res).toMatchObject({
          success: true,
          error: null,
          payload: [{ timeStamp: "2021-05-10", alerts: 225 }],
        });
      });
    });
  });

  describe("getTotalAlerts", () => {
    it("should throw when 'from' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlerts(null, DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
      await AlertClient.getTotalAlerts("", DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
    });
    it("should throw when 'to' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlerts(DATE_RANGE.from, null).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
      await AlertClient.getTotalAlerts(DATE_RANGE.from, "").catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
    });

    it("should return a valid response", async () => {
      expect.assertions(1);
      await AlertClient.getTotalAlerts(DATE_RANGE.from, DATE_RANGE.to).then(
        (res) => {
          expect(res).toMatchObject({
            success: true,
            error: null,
            payload: [{ timeStamp: "2021-05-10", alerts: 225 }],
          });
        }
      );
    });
  });
});

describe("Header", () => {
  it("renders on screen", () => {
    const { getByText } = render(
      <Header
        todayAlertCount={1}
        yesterdayAlertCount={0}
        pastWeekAlertCount={0}
        pastMonthAlertCount={0}
      />
    );
    expect(getByText("Real-time red alerts in Israel")).toBeInTheDocument();
  });

  describe("Today's alert count", () => {
    it("should show today only", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={0}
          pastWeekAlertCount={0}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
    });
    it("should show today and yesterday", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={2}
          pastWeekAlertCount={0}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText("Yesterday, there were 2 red alerts")
      ).toBeInTheDocument();
    });
    it("should show today, yesterday and past week", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={2}
          pastWeekAlertCount={3}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Yesterday, there were 2 red alerts, and a total of 3 in the past week"
        )
      ).toBeInTheDocument();
    });
    it("should show today, yesterday and past month", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={2}
          pastWeekAlertCount={0}
          pastMonthAlertCount={3}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Yesterday, there were 2 red alerts, and a total of 3 in the past month"
        )
      ).toBeInTheDocument();
    });
    it("should show today and past week", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={0}
          pastWeekAlertCount={2}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText("In the past week, there were 2 red alerts")
      ).toBeInTheDocument();
    });
    it("should show today, past week and past month", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={0}
          pastWeekAlertCount={2}
          pastMonthAlertCount={3}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText(
          "In the past week, there were 2 red alerts, and a total of 3 in the past month"
        )
      ).toBeInTheDocument();
    });
    it("should show today and past month", () => {
      render(
        <Header
          todayAlertCount={1}
          yesterdayAlertCount={0}
          pastWeekAlertCount={0}
          pastMonthAlertCount={2}
        />
      );
      expect(screen.getByText("Red alerts today")).toBeInTheDocument();
      expect(
        screen.getByText("In the past month, there were 2 red alerts")
      ).toBeInTheDocument();
    });
  });

  describe("Yesterday's alert count", () => {
    it("should show yeserday only", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={1}
          pastWeekAlertCount={0}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts yesterday")).toBeInTheDocument();
    });
    it("should show yeserday and past week", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={1}
          pastWeekAlertCount={2}
          pastMonthAlertCount={0}
        />
      );
      expect(screen.getByText("Red alerts yesterday")).toBeInTheDocument();
      expect(
        screen.getByText("In the past week, there were 2 red alerts")
      ).toBeInTheDocument();
    });
    it("should show yeserday, past week and past month", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={1}
          pastWeekAlertCount={2}
          pastMonthAlertCount={3}
        />
      );
      expect(screen.getByText("Red alerts yesterday")).toBeInTheDocument();
      expect(
        screen.getByText(
          "In the past week, there were 2 red alerts, and a total of 3 in the past month"
        )
      ).toBeInTheDocument();
    });
    it("should show yeserday and past month", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={1}
          pastWeekAlertCount={0}
          pastMonthAlertCount={2}
        />
      );
      expect(screen.getByText("Red alerts yesterday")).toBeInTheDocument();
      expect(
        screen.getByText("In the past month, there were 2 red alerts")
      ).toBeInTheDocument();
    });
  });

  describe("Past week's alert count", () => {
    it("should show past week's only", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={0}
          pastWeekAlertCount={1}
          pastMonthAlertCount={0}
        />
      );
      expect(
        screen.getByText("Red alerts in the past week")
      ).toBeInTheDocument();
    });
    it("should show past week and past month", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={0}
          pastWeekAlertCount={1}
          pastMonthAlertCount={2}
        />
      );
      expect(
        screen.getByText("Red alerts in the past week")
      ).toBeInTheDocument();
      expect(
        screen.getByText("In the past month, there were 2 red alerts")
      ).toBeInTheDocument();
    });
  });

  describe("Past month's alert count", () => {
    it("should show past month's only", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={0}
          pastWeekAlertCount={0}
          pastMonthAlertCount={1}
        />
      );
      expect(
        screen.getByText("Red alerts in the last month")
      ).toBeInTheDocument();
    });
  });

  describe("Most recent alert ", () => {
    it("was a month ago", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={0}
          pastWeekAlertCount={0}
          pastMonthAlertCount={0}
          mostRcentAlertAge={1}
        />
      );
      expect(
        screen.getByText("Last red alert was a month ago")
      ).toBeInTheDocument();
    });
    it("was X months ago", () => {
      render(
        <Header
          todayAlertCount={0}
          yesterdayAlertCount={0}
          pastWeekAlertCount={0}
          pastMonthAlertCount={0}
          mostRcentAlertAge={2}
        />
      );
      expect(
        screen.getByText("Last red alert was 2 months ago")
      ).toBeInTheDocument();
    });
  });
});
