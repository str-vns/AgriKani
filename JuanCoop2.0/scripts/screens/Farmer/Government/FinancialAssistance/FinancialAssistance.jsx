const financialAssistanceOptions = [
    { id: '1', title: 'Government Loan Program', screen: 'GovernmentLoanProgram' },
    { id: '2', title: 'Private Banks & Lending Institutions', screen: 'PrivateBanks' },
    { id: '3', title: 'Microfinance Institutions', screen: 'MicrofinanceInstitutions' },
    { id: '4', title: 'Grants', screen: 'Grants' },
  ];
  
  const FinancialAssistance = ({ navigation }) => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Financial Assistance</Text>
        </View>
  
        <View style={styles.assistanceContainer}>
          {financialAssistanceOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.assistanceButton} onPress={() => navigation.navigate(option.screen)}>
              <Text style={styles.assistanceTitle}>{option.title}</Text>
              <Text style={styles.assistanceDescription}>
                Loans offered by government agencies with favorable interest rates and repayment terms
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  export default FinancialAssistance;  