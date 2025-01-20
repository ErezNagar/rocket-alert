/*
    Concatenates pre-compiled hardcoded graph data with dynamic data pulled server.
*/
export const concatGraphData = (precompiledData, data, deleteCount = 1) => {
  data.splice(0, deleteCount);
  return [...precompiledData, ...data];
};

/*
    Concatenates pre-compiled hardcoded graph data with dynamic data pulled server.
    For Alerts By Day graph
*/
export const concatAlertsByDayGraphData = (precompiledData, data) => {
  Object.keys(data).forEach((yearKey) => {
    if (yearKey !== "years") {
      precompiledData[yearKey] = data[yearKey];
    }
  });
  precompiledData.years.push(...data.years);
  return precompiledData;
};
