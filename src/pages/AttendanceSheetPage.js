import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import icons from the Expo vector-icons library
import axios from 'axios';

const AttendanceSheetPage = ({ navigation }) => {
  const [attendanceData, setAttendance] = useState([]);
  const [nonMakeupDates, setNonMakeupDates] = useState([]);
  const [makeupDates, setMakeupDates] = useState([]);
  const [nonMakeupSchedules, setNonMakeupSchedules] = useState([]);
  const [makeupSchedules, setMakeupSchedules] = useState([]);
  const [searchInput, setSearchInput] = useState('');


  useEffect(() => {
    // Fetch financial statements from your API
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('https://rotary-ams.site/api/attendance-sheet');
        setAttendance(response.data);
        let non_makeup_schedules = response.data.non_makeup_schedules;
        let makeup_schedules = response.data.makeup_schedules;
        let nonMakeupScheduleDates = []
        let makeupScheduleDates = []
        
        for (schedule in non_makeup_schedules) {
            nonMakeupScheduleDates.push(non_makeup_schedules[schedule].date)
        }
        for (schedule in makeup_schedules) {
            makeupScheduleDates.push(makeup_schedules[schedule].date)
        }
        setNonMakeupDates([...new Set(nonMakeupScheduleDates)])
        setMakeupDates([...new Set(makeupScheduleDates)])
        setNonMakeupSchedules(non_makeup_schedules)
        setMakeupSchedules(makeup_schedules)
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  const renderHeaderCell = (date) => (
    <View style={styles.headerCell}>
      <Text style={styles.headerText}>{date.toString().slice(5)}</Text>
    </View>
  );

  const renderMemberRow = (member) => {
    const { id, first_name, last_name } = member;
    const memberAttendanceData = attendanceData.attendance_data[id].non_makeup || {};
    let scheduleIds = [];
    for (scheduleIndex in nonMakeupSchedules) {
        let schedule = nonMakeupSchedules[scheduleIndex];
        scheduleIds.push(schedule.id);
    }
    const highlightedIndexes = checkConsecutiveAbsences(memberAttendanceData, scheduleIds);
    
    const memberFullName = `${first_name} ${last_name}`.toLowerCase(); // Convert to lowercase for case-insensitive search

    // Check if the member's full name matches the search input
    const showMemberRow = memberFullName.includes(searchInput.toLowerCase());
  
    if (showMemberRow) {
        return (
        <View style={[styles.row, styles.rowWithBorder]}>
            <Text style={styles.memberName}>{first_name} {last_name}</Text>
            {(() => {
                let status = [];
                let rowIndex = 0;
                for (scheduleIndex in nonMakeupSchedules) {
                    let schedule = nonMakeupSchedules[scheduleIndex]
                    status.push(<View key={`${schedule.id}-${first_name}-${last_name}`} style={[styles.cell]}>
                        <Text style={[styles.attendanceStatusText, highlightedIndexes[rowIndex] ? styles.consecutiveAbsentCell : null]}>
                        {memberAttendanceData[schedule.id] === 'Present' ? '✔️' : '❌'}
                        </Text>
                    </View>)
                    rowIndex++;
                }
                return status;
            })()}
        </View>
        );
    } else {
        return null;
    }
  };

  const checkConsecutiveAbsences = (attendanceData, scheduleIds) => {
    let consecutiveCount = 0;
    let highlightedIndexes = [];
  
    for (const scheduleId of scheduleIds) {
      if (attendanceData[scheduleId] === 'Absent') {
        consecutiveCount++;
        if (consecutiveCount >= 3) {
        highlightedIndexes[scheduleIds.indexOf(scheduleId)] = true;
        highlightedIndexes[scheduleIds.indexOf(scheduleId) - 1] = true;
        highlightedIndexes[scheduleIds.indexOf(scheduleId) - 2] = true;
        }
      } else {
        consecutiveCount = 0;
        
      }
    }
    return highlightedIndexes;
  };
  

  return (
    <View style={styles.container}>
        <TextInput
        style={styles.searchInput}
        placeholder="Search for member name"
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
        />
        <ScrollView style={styles.scrollViewContainer} horizontal>

            <View>
                <View style={styles.header}>
                    <Text style={styles.memberHeaderText}>Member</Text>
                    {nonMakeupDates.map(renderHeaderCell)}
                </View>
                <FlatList
                    data={attendanceData.members}
                    renderItem={({ item }) => renderMemberRow(item)}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        padding: 16,
    },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    padding: 6,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    border: 5
  },
  memberHeaderText: {
    fontWeight: 'bold',
    width: 100,
  },
  memberName: {
    width: 100,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  attendanceStatusText: {
    fontSize: 18,
  },
  rowWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingBottom: 8,
  },
  consecutiveAbsentCell: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Light red background for consecutive absences
  },
  searchInput: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
  },
});

export default AttendanceSheetPage;
