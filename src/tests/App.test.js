import AlertClient from "../rocket_alert_client";

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
          console.log("res:", res);
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
