// Import Firebase Functions and Admin SDK
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Cloud function to monitor temperature updates
exports.sendTemperatureAlert = functions.database.ref(
    "/sensorData/temperature")
    .onUpdate((change, context) => {
      const newTemperature = change.after.val();
      const previousTemperature = change.before.val();

      // Trigger notification if temperature changes
      if (newTemperature !== previousTemperature) {
        const payload = {
          notification: {
            title: "Temperature Alert",
            body: `The temperature has changed to ${newTemperature}°C`,
          },
        };

        // Send notification to the "temperature_alerts" topic
        return admin.messaging().sendToTopic("temperature_alerts", payload)
            .then((response) => {
              console.log("Temperature alert sent successfully:", response);
              return null;
            })
            .catch((error) => {
              console.error("Error sending temperature alert:", error);
            });
      }
      return null;
    });
