import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Rider/Register";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { assignLocation } from "@redux/Actions/driverActions";

const RiderAssignLoc = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const context = useContext(AuthGlobal);
    const driverId = props.route.params.driverId;
    const { Deliveryloading , errors } = useSelector((state) => state.driverApi);
    const [barangay, setBarangay] = useState("");
    const [city, setCity] = useState("");
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");
    const data = {
        // Abra: ["Bangued", "Boliney", "Bucay", "Bucloc", "Daguioman", "Danglas", "Dolores", "La Paz", "Lacub", "Lagangilang", "Lagayan", "Langiden", "Licuan-Baay", "Luba", "Malibcong", "Manabo", "Peñarrubia", "Pidigan", "Pilar", "Sallapadan", "San Isidro", "San Juan", "San Quintin", "Tayum", "Tineg", "Tubo", "Villaviciosa"],
        // Albay: ["Bacacay", "Camalig", "Daraga", "Guinobatan", "Jovellar", "Legazpi", "Libon", "Ligao", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo", "Tiwi"],
        // Apayao: ["Calanasan", "Conner", "Flora", "Kabugao", "Luna", "Pudtol", "Santa Marcela"],
        // Aurora: ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Dipaculao", "Maria Aurora", "San Luis"],
        // Bataan: ["Abucay", "Bagac", "Balanga", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"],
        // Batanes: ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
        // Batangas: ["Agoncillo", "Alitagtag", "Balayan", "Balete", "Bauan", "Calaca", "Calatagan", "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lipa", "Lobo", "Mabini", "Malvar", "Mataasnakahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis", "San Nicolas", "San Pascual", "Santa Teresita", "Santo Tomas", "Taal", "Talisay", "Tanauan", "Taysan", "Tingloy", "Tuy"],
        // Benguet: ["Atok", "Baguio", "Bakun", "Bokod", "Buguias", "Itogon", "Kabayan", "Kapangan", "Kibungan", "La Trinidad", "Mankayan", "Sablan", "Tuba", "Tublay"],
        Bulacan: ["Angat", "Balagtas", "Baliuag", "Bocaue", "Bulacan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Malolos", "Marilao", "Meycauayan", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose del Monte", "San Miguel", "San Rafael", "Santa Maria"],
    //     Caloocan: ["Bagumbayan", "Bagumbayan North", "Balintawak", "Bangkulasi", "Barangay 1", "Barangay 2", 
    // "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", 
    // "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", 
    // "Barangay 15", "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20", 
    // "Barangay 21", "Barangay 22", "Barangay 23", "Barangay 24", "Barangay 25", "Barangay 26", 
    // "Barangay 27", "Barangay 28", "Barangay 29", "Barangay 30", "Barangay 31", "Barangay 32", 
    // "Barangay 33", "Barangay 34", "Barangay 35", "Barangay 36", "Barangay 37", "Barangay 38", 
    // "Barangay 39", "Barangay 40", "Barangay 41", "Barangay 42", "Barangay 43", "Barangay 44", 
    // "Barangay 45", "Barangay 46", "Barangay 47", "Barangay 48", "Barangay 49", "Barangay 50", 
    // "Barangay 51", "Barangay 52", "Barangay 53", "Barangay 54", "Barangay 55", "Barangay 56", 
    // "Barangay 57", "Barangay 58", "Barangay 59", "Barangay 60", "Barangay 61", "Barangay 62", 
    // "Barangay 63", "Barangay 64", "Barangay 65", "Barangay 66", "Barangay 67", "Barangay 68", 
    // "Barangay 69", "Barangay 70", "Barangay 71", "Barangay 72", "Barangay 73", "Barangay 74", 
    // "Barangay 75", "Barangay 76", "Barangay 77", "Barangay 78", "Barangay 79", "Barangay 80", 
    // "Barangay 81", "Barangay 82", "Barangay 83", "Barangay 84", "Barangay 85", "Barangay 86", 
    // "Barangay 87", "Barangay 88", "Barangay 89", "Barangay 90", "Barangay 91", "Barangay 92", 
    // "Barangay 93", "Barangay 94", "Barangay 95", "Barangay 96", "Barangay 97", "Barangay 98", 
    // "Barangay 99", "Barangay 100", "Barangay 101", "Barangay 102", "Barangay 103", "Barangay 104", 
    // "Barangay 105", "Barangay 106", "Barangay 107", "Barangay 108", "Barangay 109", "Barangay 110", 
    // "Barangay 111", "Barangay 112", "Barangay 113", "Barangay 114", "Barangay 115", "Barangay 116", 
    // "Barangay 117", "Barangay 118", "Barangay 119", "Barangay 120", "Barangay 121", "Barangay 122", 
    // "Barangay 123", "Barangay 124", "Barangay 125", "Barangay 126", "Barangay 127", "Barangay 128", 
    // "Barangay 129", "Barangay 130", "Barangay 131", "Barangay 132", "Barangay 133", "Barangay 134", 
    // "Barangay 135", "Barangay 136", "Barangay 137", "Barangay 138", "Barangay 139", "Barangay 140", 
    // "Barangay 141", "Barangay 142", "Barangay 143", "Barangay 144", "Barangay 145", "Barangay 146", 
    // "Barangay 147", "Barangay 148", "Barangay 149", "Barangay 150", "Barangay 151", "Barangay 152", 
    // "Barangay 153", "Barangay 154", "Barangay 155", "Barangay 156", "Barangay 157", "Barangay 158", 
    // "Barangay 159", "Barangay 160", "Barangay 161", "Barangay 162", "Barangay 163", "Barangay 164", 
    // "Barangay 165", "Barangay 166", "Barangay 167", "Barangay 168", "Barangay 169", "Barangay 170", 
    // "Barangay 171", "Barangay 172", "Barangay 173", "Barangay 174", "Barangay 175", "Barangay 176", 
    // "Barangay 177", "Barangay 178", "Barangay 179", "Barangay 180", "Barangay 181", "Barangay 182", 
    //      "Barangay 183", "Barangay 184", "Barangay 185", "Barangay 186", "Barangay 187", "Barangay 188"],
    //     "Camarines Sur": ["Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Iriga", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Naga", "Ocampo", "Pamplona", "Pasacao", "Pili", "Presentacion", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"],
    //     "Camarines Norte": ["Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"],
    //     Camiguin: ["Catarman", "Guinsiliban", "Mahinog", "Mambajao", "Sagay"],
    //     Capiz: ["Cuartero", "Dao", "Dumalag", "Dumarao", "Ivisan", "Jamindan", "Ma-ayon", "Mambusao", "Panay", "Panitan", "Pilar", "Pontevedra", "President Roxas", "Roxas", "Sapian", "Sigma", "Tapaz"],
    //     Catanduanes: ["Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban", "San Andres", "San Miguel", "Viga", "Virac"],
    //     Cagayan: ["Abulug", "Alcala", "Allacapan", "Amulung", "Aparri", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Peñablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño", "Solana", "Tuao", "Tuguegarao"],
    //     Cavite: ["Alfonso", "Amadeo", "Bacoor", "Carmona", "Cavite City", "Dasmariñas", "General Mariano Alvarez", "General Emilio Aguinaldo", "General Trias", "Imus", "Indang", "Kawit", "Magallanes", "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tagaytay", "Tanza", "Ternate", "Trece Martires"],
    //     Ifugao: ["Aguinaldo", "Alfonso Lista", "Asipulo", "Banaue", "Hingyon", "Hungduan", "Kiangan", "Lagawe", "Lamut", "Mayoyao", "Tinoc"],
    //     "Ilocos Norte": ["Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Batac", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"],
    //     "Ilocos Sur" : ["Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Candon", "Caoayan", "Cervantes", "Galimuyod", "Gregorio del Pilar", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino", "Salcedo", "San Emilio", "San Esteban", "San Ildefonso", "San Juan", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin", "Vigan"],
    //     Isabela: ["Alicia", "Angadanan", "Aurora", "Benito Soliven", "Burgos", "Cabagan", "Cabatuan", "Cauayan", "Cordon", "Delfin Albano", "Dinapigue", "Divilacan", "Echague", "Gamu", "Ilagan", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santiago", "Santo Tomas", "Tumauini"],
    //     Kalinga: ["Balbalan", "Lubuagan", "Pasil", "Pinukpuk", "Rizal", "Tabuk", "Tanudan", "Tinglayan"],
    //     Laguna: ["Alaminos", "Bay", "Biñan", "Cabuyao", "Calamba", "Calauan", "Cavinti", "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac", "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila", "Rizal", "San Pablo", "San Pedro", "Santa Cruz", "Santa Maria", "Santa Rosa", "Siniloan", "Victoria"],
    //     "La Union": ["Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Fernando", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"],
    //     "Lanao del Norte": ["Bacolod", "Baloi", "Baroy", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo", "Tagoloan", "Tangcal", "Tubod"],
        // "Las Piñas": ["Almanza Uno", "Almanza Dos", "CAA-BF International", "Daniel Fajardo", "Elias Aldana", "Ilaya", "Manuyo Uno", "Manuyo Dos", "Pamplona Uno", "Pamplona Dos", "Pilar Village", "Pulang Lupa Uno", "Pulang Lupa Dos", "Talon Uno", "Talon Dos", "Talon Tres", "Talon Kuatro", "Zapote"],
        // Manila: ["Binondo", "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Port Area", "Quiapo", "Sampaloc", "San Andres", "San Miguel", "San Nicolas", "Santa Ana", "Santa Cruz", "Santa Mesa", "Tondo"],
        // Makati: ["Bangkal", "Bel-Air", "Carmona", "Cembo", "Comembo", "Dasmarinas", "East Rembo", "Forbes Park", "Guadalupe Nuevo", "Guadalupe Viejo", "Kasilawan", "La Paz", "Magallanes", "Olympia", "Palanan", "Pembo", "Pinagkaisahan", "Pio del Pilar", "Pitogo", "Poblacion", "Post Proper Northside", "Post Proper Southside", "Rizal", "San Antonio", "San Isidro", "San Lorenzo", "Santa Cruz", "Singkamas", "South Cembo", "Tejeros", "Urdaneta", "Valenzuela", "West Rembo"],
        // Mandaluyong: ["Bagong Silang", "Barangka Drive", "Barangka Ibaba", "Barangka Ilaya", "Barangka Itaas", "Buayang Bato", "Burol", "Daang Bakal", "Hagdang Bato", "Harapin Ang Bukas", "Highway Hills", "Hulo", "Mabini-J. Rizal", "Malamig", "Mauway", "Namayan", "New Zañiga", "Old Zañiga", "Pag-asa", "Plainview", "Pleasant Hills", "Poblacion", "San Jose", "Vergara", "Wack-Wack Greenhills", "Wack-Wack East Greenhills", "Wack-Wack West Greenhills"],
        // Marikina: ["Barangka", "Calumpang", "Concepcion Uno", "Concepcion Dos", "Fortune", "Industrial Valley", "Jesus de la Peña", "Malanday", "Malanday", "Nangka", "Parang", "San Roque", "Santa Elena", "Santo Niño", "Tañong", "Tumana"],
        // Masbate: ["Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpuz", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"],
        // Marinduque: ["Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"],
        // "Mountain Province": ["Barlig", "Bauko", "Besao", "Bontoc", "Natonin", "Paracelis", "Sabangan", "Sadanga", "Sagada", "Tadian"],
        // Muntinlupa: ["Alabang", "Ayala Alabang", "Bayanan", "Buli", "Cupang", "Poblacion", "Putatan", "Sucat", "Tunasan"],
        // Malabon: ["Acacia", "Baritan", "Bayan-Bayanan", "Catmon", "Concepcion", "Dampalit", "Flores", "Hulong Duhat", "Ibaba", "Longos", "Maysilo", "Muzon", "Niugan", "Panghulo", "Potrero", "San Agustin", "Santulan", "Tanong", "Tinajeros", "Tugatog"],
        // Navotas: ["Bagumbayan North", "Bagumbayan South", "Bangculasi", "Daanghari", "Navotas East", "Navotas West", "North Bay Boulevard North", "North Bay Boulevard South", "San Jose", "Sipac-Almacen", "Tangos"],
        // "Nueva Ecija": ["Aliaga", "Bongabon", "Cabanatuan", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon", "Gapan", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Nampicuan", "Palayan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Jose", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"],
        // "Nueva Vizcaya" : ["Alfonso Castaneda", "Ambaguio", "Aritao", "Bagabag", "Bambang", "Bayombong", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"],
        // "Occidental Mindoro": ["Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Mamburao", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"],
        // "Oriental Mindoro": ["Baco", "Bansud", "Bongabong", "Bulalacao", "Calapan", "Gloria", "Mansalay", "Naujan", "Pinamalayan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"],
    //     Parañque: ["Baclaran", "Don Bosco", "La Huerta", "Marcelo Green Village", "Moonwalk", "San Antonio", "San Dionisio", "San Isidro", "San Martin de Porres", "San Miguel", "San Pedro", "Santa Clara", "Santa Cruz", "Santo Niño", "Santolan", "Tambo", "Vitalez"],
    //     Pasay: ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15", "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20", 
    // "Barangay 21", "Barangay 22", "Barangay 23", "Barangay 24", "Barangay 25", "Barangay 26", 
    // "Barangay 27", "Barangay 28", "Barangay 29", "Barangay 30", "Barangay 31", "Barangay 32", 
    // "Barangay 33", "Barangay 34", "Barangay 35", "Barangay 36", "Barangay 37", "Barangay 38", 
    // "Barangay 39", "Barangay 40", "Barangay 41", "Barangay 42", "Barangay 43", "Barangay 44", 
    // "Barangay 45", "Barangay 46", "Barangay 47", "Barangay 48", "Barangay 49", "Barangay 50", 
    // "Barangay 51", "Barangay 52", "Barangay 53", "Barangay 54", "Barangay 55", "Barangay 56", 
    // "Barangay 57", "Barangay 58", "Barangay 59", "Barangay 60", "Barangay 61", "Barangay 62", 
    // "Barangay 63", "Barangay 64", "Barangay 65", "Barangay 66", "Barangay 67", "Barangay 68", 
    // "Barangay 69", "Barangay 70", "Barangay 71", "Barangay 72", "Barangay 73", "Barangay 74", 
    // "Barangay 75", "Barangay 76", "Barangay 77", "Barangay 78", "Barangay 79", "Barangay 80", 
    // "Barangay 81", "Barangay 82", "Barangay 83", "Barangay 84", "Barangay 85", "Barangay 86", 
    // "Barangay 87", "Barangay 88", "Barangay 89", "Barangay 90", "Barangay 91", "Barangay 92", 
    // "Barangay 93", "Barangay 94", "Barangay 95", "Barangay 96", "Barangay 97", "Barangay 98", 
    // "Barangay 99", "Barangay 100", "Barangay 101", "Barangay 102", "Barangay 103", "Barangay 104", 
    // "Barangay 105", "Barangay 106", "Barangay 107", "Barangay 108", "Barangay 109", "Barangay 110", 
    // "Barangay 111", "Barangay 112", "Barangay 113", "Barangay 114", "Barangay 115", "Barangay 116", 
    // "Barangay 117", "Barangay 118", "Barangay 119", "Barangay 120", "Barangay 121", "Barangay 122", 
    // "Barangay 123", "Barangay 124", "Barangay 125", "Barangay 126", "Barangay 127", "Barangay 128", 
    // "Barangay 129", "Barangay 130", "Barangay 131", "Barangay 132", "Barangay 133", "Barangay 134", 
    // "Barangay 135", "Barangay 136", "Barangay 137", "Barangay 138", "Barangay 139", "Barangay 140", 
    // "Barangay 141", "Barangay 142", "Barangay 143", "Barangay 144", "Barangay 145", "Barangay 146", 
    // "Barangay 147", "Barangay 148", "Barangay 149", "Barangay 150", "Barangay 151", "Barangay 152", 
    // "Barangay 153", "Barangay 154", "Barangay 155", "Barangay 156", "Barangay 157", "Barangay 158", 
    // "Barangay 159", "Barangay 160", "Barangay 161", "Barangay 162", "Barangay 163", "Barangay 164", 
    // "Barangay 165", "Barangay 166", "Barangay 167", "Barangay 168", "Barangay 169", "Barangay 170", 
    // "Barangay 171", "Barangay 172", "Barangay 173", "Barangay 174", "Barangay 175", "Barangay 176", 
    // "Barangay 177", "Barangay 178", "Barangay 179", "Barangay 180", "Barangay 181", "Barangay 182", 
    //      "Barangay 183", "Barangay 184", "Barangay 185", "Barangay 186", "Barangay 187", "Barangay 188","Barangay 189", "Barangay 190", "Barangay 191", 
    //     "Barangay 192","Barangay 193","Barangay 194", "Barangay 195", "Barangay 196", "Barangay 197", "Barangay 198",  "Barangay 199",  "Barangay 200",  "Barangay 201", ],
    //     Pasig: ["Bagong Ilog", "Bagong Katipunan", "Bagong Lipunan", "Bagong Tanyag", "Bagumbayan", "Bambang", "Buting", "Caniogan", "Del Remedio", "Kalawaan", "Kapasigan", "Kapitolyo", "Malinao", "Manggahan", "Maybunga", "Oranbo", "Palatiw", "Pinagbuhatan", "Pineda", "Rosario", "Sagad", "San Antonio", "San Joaquin", "San Jose", "San Miguel", "San Nicolas", "Santa Cruz", "Santa Lucia", "Santa Rosa", "Santo Tomas", "Santolan", "Socorro", "Sumilang", "Ugong", "Ugong Norte"],
        // Pampanga: ["Angeles", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat", "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Fernando", "San Luis", "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan"],
        // Palawan: ["Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Puerto Princesa", "Quezon", "Rizal", "Roxas", "San Vicente", "Sofronio Española", "Taytay"],
        // Pangasinan: ["Agno", "Aguilar", "Alaminos", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dagupan", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozorrubio", "Rosales", "San Carlos", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Urdaneta", "Villasis"], 
        // Pateros: ["Aguho", "Martirez del '96", "Poblacion"],
        // Quezon: ["Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan", "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig", "Lopez", "Lucban", "Lucena", "Macalelon", "Mauban", "Mulanay", "Padre Burgos", "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo", "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco", "San Narciso", "Sariaya", "Tagkawayan", "Tiaong", "Unisan"],
        // Quirino: ["Aglipay", "Cabarroguis", "Diffun", "Maddela", "Nagtipunan", "Saguday"],
        // Rizal: ["Angono", "Antipolo", "Baras", "Binangonan", "Cainta", "Cardona", "Jalajala", "Morong", "Pililla", "Rodriguez", "San Mateo", "Tanay", "Taytay", "Teresa"],
        // Romblon: ["Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "Romblon", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria"],
        // "San Juan": ["Addition Hills", "Balong-Bato", "Batis", "Corazon de Jesus", "Ermitaño", "Greenhills", "Halcon", "Isabelita", "Kabayanan", "Little Baguio", "Maytunas", "Onse", "Pasadena", "Pedro Cruz", "Progreso", "Rivera", "Salapan", "San Perfecto", "St. Joseph", "Sta. Lucia", "Sta. Teresita", "Tibagan", "West Crame"],
        // Sorsogon: ["Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena", "Sorsogon"],
        // Tarlac: ["Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Tarlac", "Victoria"],
        // Taguig: ["Bagumbayan", "Bambang", "Calzada", "Fort Bonifacio", "Hagonoy", "Ibayo-Tipas","Katuparan", "Ligid-Tipas", "Lower Bicutan", "New Lower Bicutan", "New Upper Bicutan", "North Daang Hari", "North Signal Village", "Northbay Boulevard North", "Northbay Boulevard South", "Pinagsama", "San Miguel", "Santa Ana", "Tanyag", "Tuktukan", "Upper Bicutan", "Ususan", "Wawa", "Western Bicutan"],
        // Valenzuela: ["Arkong Bato", "Bagbaguin", "Bignay", "Canumay", "Coloong", "Dalandanan", "Isla", "Karuhatan", "Lingunan", "Mabolo", "Malanday", "Malinta", "Mapulang Lupa", "Marulas", "Maysan", "Palasan", "Parada", "Pariancillo Villa", "Paso de Blas", "Pasolo", "Poblacion", "Polo", "Punturin", "Rincon", "Tagalag", "Ugong", "Veinte Reales"],
        // Zambales: ["Botolan", "Cabangan", "Candelaria", "Castillejos", "Iba", "Masinloc", "Olongapo", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"],
    }

    useEffect(() => {
        const fetchJwt = async () => {
          try {
            const res = await AsyncStorage.getItem("jwt");
            setToken(res);
          } catch (error) {
            console.error("Error retrieving JWT: ", error);
          }
        };
        fetchJwt();
      }, []);

    const handleCancel = async () => {
    setBarangay("");
    setCity("");
    navigation.goBack();
    }
 
    const handleSave = async () => {

    if (!city || !barangay) {
        setError("Please select a city and barangay");
        return;
    }

    const data = {
        city,
        barangay,
        
    };

    dispatch(assignLocation(driverId.driverId, data, token));
    setBarangay("");
    setCity("");
    navigation.navigate("Riderlist");
    }

  

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent2}>


        <View style={styles.form}>
              <Text style={styles.label}>Select Location</Text>
                 <Picker
                      selectedValue={city}
                      onValueChange={(itemValue) => setCity(itemValue)}
                      style={styles.pickerStyle2}
                    >
                      <Picker.Item label="Select a City" value="" enabled={false}  />
                      {Object.keys(data).map((city) => (
                        <Picker.Item key={city} label={city} value={city} />
                      ))}
                    </Picker>

                    <Picker
                      selectedValue={barangay}
                      onValueChange={(itemValue) => setBarangay(itemValue)}
                      enabled={city !== "" }
                      style={styles.pickerStyle2}
                    >
                      <Picker.Item label="Select a Barangay" value="" enabled={false}  />
                      {( data[city] || []).map((barangay) => (
                        <Picker.Item key={barangay} label={barangay} value={barangay} />
                        )
                      )}

                    </Picker> 
     {city && barangay ? (
        <Text style={styles.result}>
          Selected City: {city}, Barangay: {barangay}
        </Text>
      ) : null}
      </View>

       
                {errors || error && <Text style={styles.errorText}>{errors || error}</Text>}
      </ScrollView>
  
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} 
        onPress={() => handleSave()}
        disabled={Deliveryloading}>
          {Deliveryloading ? ( <ActivityIndicator size={"small"} color="#fff" /> ) : ( <Text style={styles.saveText}>Save</Text> )}
  
        </TouchableOpacity>
      </View>


    </KeyboardAvoidingView>
  );
};


export default RiderAssignLoc;
