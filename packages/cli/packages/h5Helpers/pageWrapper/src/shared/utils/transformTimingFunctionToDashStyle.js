function transformTimingFunctionToDashStyle(timingFunctionName) {
  return timingFunctionName.replace(/([A-Z])/g, function(match, p) {
    return `-${p.toLowerCase()}`;
  });
}

export default transformTimingFunctionToDashStyle;
