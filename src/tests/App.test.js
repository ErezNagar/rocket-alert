import AlertClient from "../alert_client";

const DATE_RANGE = {
  from: "2021-05-01",
  to: "2021-06-01",
};

describe("AlertClient", () => {
  describe("getTotalAlertsByDay", () => {
    test("should throw when 'from' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlertsByDay(null, DATE_RANGE.to).catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
      await AlertClient.getTotalAlertsByDay("", DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
    });
    test("should throw when 'to' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlertsByDay(DATE_RANGE.from, null).catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
      await AlertClient.getTotalAlertsByDay(DATE_RANGE.from, "").catch(
        (error) => expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
    });
  });
  describe("getTotalAlerts", () => {
    test("should throw when 'from' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlerts(null, DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
      await AlertClient.getTotalAlerts("", DATE_RANGE.to).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: from"))
      );
    });
    test("should throw when 'to' is invalid", async () => {
      expect.assertions(2);
      await AlertClient.getTotalAlerts(DATE_RANGE.from, null).catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
      await AlertClient.getTotalAlerts(DATE_RANGE.from, "").catch((error) =>
        expect(error).toMatchObject(new Error("Invalid Date: to"))
      );
    });
  });
});
