import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import icons from the Expo vector-icons library
import axios from 'axios';

const FinancialStatementsPage = ({ navigation }) => {
  const [financialStatements, setFinancialStatements] = useState([]);

  useEffect(() => {
    // Fetch financial statements from your API
    const fetchFinancialStatements = async () => {
      try {
        const response = await axios.get('https://rotary-ams.site/api/links?financial');
        setFinancialStatements(response.data);
      } catch (error) {
        console.error('Error fetching financial statements:', error);
      }
    };

    fetchFinancialStatements();
  }, []);

  const handleStatementSelection = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Financial Statement:</Text>
      <View style={styles.buttonContainer}>
        {financialStatements.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={styles.button}
            onPress={() => handleStatementSelection(link.url)}
          >
            {(() => {
              if (link.title == 'Members Tracker')
                return (<FontAwesome5 name="users" size={24} color="#FFF" style={styles.buttonIcon} />);
              else if (link.title == 'Cash Receipt')
                return (<FontAwesome5 name="money-bill" size={24} color="#FFF" style={styles.buttonIcon} />);
              else if (link.title == 'Club Dues Tracker')
                return (<FontAwesome5 name="dollar-sign" size={24} color="#FFF" style={styles.buttonIcon} />);
              else if (link.title == 'Club Financial Performance')
                return (<FontAwesome5 name="chart-line" size={24} color="#FFF" style={styles.buttonIcon} />);
              else if (link.title == 'Cash Distribution')
                return (<FontAwesome5 name="hand-holding-usd" size={24} color="#FFF" style={styles.buttonIcon} />);
            })()}
            <Text style={styles.buttonText}>{link.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#06478F',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBA418',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default FinancialStatementsPage;
