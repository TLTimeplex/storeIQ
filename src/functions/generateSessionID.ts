export function _SIQ_generateSessionID(): number {
  // Check if a session ID is already set
  var currentSessionID = sessionStorage.getItem('sessionID');
  if (currentSessionID !== null) {
    return parseInt(currentSessionID);
  } else {
    // Generate a new session ID
    var newSessionID = new Date().getTime();
    sessionStorage.setItem('sessionID', newSessionID.toString());
    return newSessionID;
  }
}