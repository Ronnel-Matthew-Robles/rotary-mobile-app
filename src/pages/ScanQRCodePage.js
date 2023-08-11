import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";

const ScanQRCodePage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [err, setError] = useState('');

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    askForCameraPermission();
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const response = await axios("https://rotary-ams.site/api/attendance/today");
      const attendeesData = await response.data;
      setAttendees(attendeesData);
    } catch (error) {
      console.log("Error fetching attendees:", error);
    }
  };

  const handleScan = async ({ type, data }) => {
    setScanned(true);
    setText(data);


    try {
      const response = await axios.post(
        "https://rotary-ams.site/api/attendance/log",
        { member_id: data }
      );

      if (response.status === 200) {
        setError('');
        const { member } = await response.data;

        if (member) {
          const { first_name, last_name } = member;
          setAttendanceMessage(
            `Attendance for ${first_name} ${last_name} has been logged.`
          );
          fetchAttendees(); // Fetch updated attendees after successful attendance log
        } else {
          setAttendanceMessage("Error logging attendance.");
        }
      } else {
        // Handle other status codes (e.g., 404)
        setAttendanceMessage("An unexpected error occurred.");
      }
    } catch (error) {
      console.log("Error logging attendance:", error);
      setError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setText("Not yet scanned");
    setAttendanceMessage("");
  };

  const renderAttendeeItem = ({ item }) => (
    <View style={styles.attendeeItem}>
      <Text style={styles.attendeeName}>{item.member.first_name} {item.member.last_name} </Text>
      <Text style={styles.attendeeTime}>{formatTime(item.attended_at)}</Text>
    </View>
  );

  const formatTime = (time) => {
    // Format time as "HH:mm AM/PM"
    // Example: Convert "2023-08-01 04:16:59" to "04:16 AM"
    const dateTimeObj = new Date(time);
    const hours = dateTimeObj.getHours();
    const minutes = dateTimeObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${(hours % 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return formattedTime;
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={askForCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <BarCodeScanner
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleScan}
      />
      <Text>ID: {text}</Text>
      {scanned && (
        <>
          <Text>{err}</Text>
          <Text style={styles.attendanceMessage}>{attendanceMessage}</Text>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
          >
            <Text style={styles.scanAgainButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </>
      )}
      {
        attendees.length > 0 && (
          <>
            <Text style={styles.attendeesTitle}>Attendees Today:</Text>
            <FlatList
              data={attendees}
              renderItem={renderAttendeeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.attendeesList}
            />
          </>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#06478F",
  },
  camera: {
    borderRadius: 30,
    width: "100%",
    aspectRatio: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  attendanceMessage: {
    fontSize: 16,
    color: "#06478F",
    marginTop: 16,
    textAlign: "center",
  },
  scanAgainButton: {
    backgroundColor: "#FBA418",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  scanAgainButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  attendeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
    marginBottom: 4,
    borderRadius: 8,
  },
  attendeeName: {
    fontSize: 16,
    color: "#06478F",
  },
  attendeeTime: {
    fontSize: 14,
    color: "#06478F",
  },
  attendeesTitle: {
    margin: 10,
    fontWeight: "bold",
  },
});

export default ScanQRCodePage;
