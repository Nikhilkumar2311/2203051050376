const axios = require("axios");

const LOG_SERVER_URL = "http://20.244.56.144/evaluation-service/logs";


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjAzMDUxMDUwMzc2QHBhcnVsdW5pdmVyc2l0eS5hYy5pbiIsImV4cCI6MTc1MDY3MDk3OCwiaWF0IjoxNzUwNjcwMDc4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWNjNmNkN2MtOTFjNy00OTcwLWI5NTQtZDNlOGMxZTljMTVmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibmlraGlsIGt1bWFyIiwic3ViIjoiYjAyMGY1NzItZTU1NC00ZjJmLThkZDctZWY4YTFiZDJmNWY3In0sImVtYWlsIjoiMjIwMzA1MTA1MDM3NkBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4iLCJuYW1lIjoibmlraGlsIGt1bWFyIiwicm9sbE5vIjoiMjIwMzA1MTA1MDM3NiIsImFjY2Vzc0NvZGUiOiJUUnpnV00iLCJjbGllbnRJRCI6ImIwMjBmNTcyLWU1NTQtNGYyZi04ZGQ3LWVmOGExYmQyZjVmNyIsImNsaWVudFNlY3JldCI6InJYSEVXTkdjeER5bVVuVlAifQ.igUx28hhgKOScoo3Hblv8w7SSGg4ptwdcqmAoh3RYLs";


const Log = async (stack, level, pkg, message) => {
  try {
    const logPayload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: message
    };

    await axios.post(LOG_SERVER_URL, logPayload, {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    });

    console.log("Log sent successfully");

  } catch (error) {
    console.error("Failed to send log to log server:", error.response?.status, error.response?.data);
  }
};

module.exports = Log;