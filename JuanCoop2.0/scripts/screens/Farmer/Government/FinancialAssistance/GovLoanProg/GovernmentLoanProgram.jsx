const GovernmentLoanProgram = ({ navigation }) => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Government Loan Program</Text>
        </View>
  
        <View style={styles.programContainer}>
          <Image source={require('@assets/img/Loogo.png')} style={styles.programImage} />
          <Text style={styles.programTitle}>
            Guarantee Loan Program for Agricultural Enterprises (G-PLAN)
          </Text>
          <Text style={styles.programDescription}>
            Masaganang Ani 200 Program, in support to the DA-Food Sufficiency and Poverty Alleviation Programs. This DA
            program will be implemented together with Planters Products, Inc. (PPI) who will provide production inputs, as
            a production loan, to subsistence rice farmers participating in the Masaganang Ani 200 – Plant Now Pay Later (PNPL)
            Program.
          </Text>
          <TouchableOpacity style={styles.moreButton} onPress={() => console.log('More Details')}>
            <Text style={styles.moreButtonText}>More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  
  export default GovernmentLoanProgram;  